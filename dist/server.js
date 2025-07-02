"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const routes_1 = __importDefault(require("./routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// --- Middleware ---
app.use((0, cors_1.default)({
    origin: 'https://maxcontrol.f13design.com.br',
    credentials: true,
}));
// Increase payload size limit for base64 logos
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));
// --- API Routes ---
app.use('/api', routes_1.default);
// --- Static File Serving ---
// Desnecessário porque o frontend está no cPanel
// const frontendPath = path.join(__dirname, '..', '..', 'public');
// app.use(express.static(frontendPath));
// app.get('*', (req: Request, res: Response) => {
//   res.sendFile(path.join(frontendPath, 'index.html'));
// });
// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong on the server.' });
});
// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`✔️  Backend server is running on http://localhost:${PORT}`);
});
