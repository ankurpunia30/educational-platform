// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Define custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
    level: 'info', // Default level
    format: combine(
        timestamp(),
        errors({ stack: true }), // Log stack trace in error logs
        logFormat
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'logs/error.log', level: 'error' }), // Error-specific log file
        new transports.File({ filename: 'logs/combined.log' }) // General log file
    ],
    exitOnError: false, // Prevent exit on error
});

module.exports = logger;
