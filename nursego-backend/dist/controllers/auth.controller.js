"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.sendOtp = exports.me = exports.googleLogin = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const twilio_1 = __importDefault(require("twilio"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'nursenow_super_secret_key_2026';
let twilioClient = null;
const getTwilioClient = () => {
    if (!twilioClient) {
        twilioClient = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    }
    return twilioClient;
};
const register = async (req, res) => {
    try {
        const { name, email, phone, role, password } = req.body;
        if (!password) {
            res.status(400).json({ success: false, message: 'Password is required' });
            return;
        }
        // Convert empty strings to null to prevent unique constraint errors
        const normalizedEmail = email?.trim() === '' ? null : email?.trim();
        const normalizedPhone = phone?.trim() === '' ? null : phone?.trim();
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: normalizedEmail || undefined },
                    { phone: normalizedPhone || undefined }
                ].filter(condition => Object.values(condition)[0] !== undefined)
            }
        });
        if (existingUser && (normalizedEmail || normalizedPhone)) {
            res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
            return;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const newUser = await prisma.user.create({
            data: {
                name,
                email: normalizedEmail,
                phone: normalizedPhone,
                role: role || 'PATIENT',
                password: hashedPassword,
            }
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '365d' });
        res.json({ success: true, message: 'Registration successful', token, user: newUser });
    }
    catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            res.status(400).json({ success: false, message: 'Identifier and password are required' });
            return;
        }
        const isEmail = identifier.includes('@');
        const normalizedId = isEmail ? identifier.toLowerCase().trim() : identifier.trim();
        let whereClause = {};
        if (isEmail) {
            whereClause = { email: normalizedId };
        }
        else {
            whereClause = {
                OR: [
                    { phone: normalizedId },
                    { phone: normalizedId.startsWith('+') ? normalizedId : `+91${normalizedId}` },
                    { phone: normalizedId.replace(/^\+91/, '') }
                ]
            };
        }
        const user = await prisma.user.findFirst({
            where: whereClause
        });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found. Please register first.' });
            return;
        }
        if (!user.password) {
            res.status(401).json({ success: false, message: 'You registered via Google. Please use Continue with Google.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, message: 'Login successful', token, user });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.login = login;
const googleLogin = async (req, res) => {
    try {
        const { googleId, email, name, role } = req.body;
        if (!googleId || !email) {
            res.status(400).json({ success: false, message: 'Google ID and email are required' });
            return;
        }
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { googleId },
                    { email }
                ]
            }
        });
        if (!user) {
            // Create new user via Google
            user = await prisma.user.create({
                data: {
                    googleId,
                    email,
                    name: name || 'Google User',
                    role: role || 'PATIENT',
                }
            });
        }
        else if (!user.googleId) {
            // Link Google account to existing email user
            user = await prisma.user.update({
                where: { id: user.id },
                data: { googleId }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '365d' });
        res.json({ success: true, message: 'Google login successful', token, user });
    }
    catch (error) {
        console.error('Google Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.googleLogin = googleLogin;
const me = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.error('Fetch me error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.me = me;
const sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ success: false, message: 'Phone number is required' });
            return;
        }
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        // Bypass Twilio if credentials are not set (for testing)
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_VERIFY_SERVICE_SID) {
            console.log(`[TEST MODE] OTP requested for ${formattedPhone}. Use 123456 to verify.`);
            res.json({ success: true, message: 'OTP sent successfully (Test Mode)' });
            return;
        }
        const twilioClient = getTwilioClient();
        await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to: formattedPhone, channel: 'sms' });
        res.json({ success: true, message: 'OTP sent successfully' });
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to send OTP' });
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res) => {
    try {
        const { phone, code, role } = req.body;
        if (!phone || !code) {
            res.status(400).json({ success: false, message: 'Phone and code are required' });
            return;
        }
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        // Bypass Twilio if credentials are not set (for testing)
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_VERIFY_SERVICE_SID) {
            if (code !== '123456') {
                res.status(400).json({ success: false, message: 'Invalid OTP (Test Mode expects 123456)' });
                return;
            }
        }
        else {
            const twilioClient = getTwilioClient();
            const verificationCheck = await twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
                .verificationChecks
                .create({ to: formattedPhone, code });
            if (verificationCheck.status !== 'approved') {
                res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
                return;
            }
        }
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { phone: formattedPhone },
                    { phone: phone },
                    { phone: phone.replace(/^\+91/, '') }
                ]
            }
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    phone: formattedPhone,
                    role: role || 'PATIENT',
                    name: 'New User'
                }
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'nursenow_super_secret_key_2026', { expiresIn: '365d' });
        res.json({ success: true, message: 'OTP verified successfully', token, user });
    }
    catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to verify OTP' });
    }
};
exports.verifyOtp = verifyOtp;
//# sourceMappingURL=auth.controller.js.map