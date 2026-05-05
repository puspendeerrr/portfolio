/**
 * Simple structured logging middleware
 * Logs requests and errors in a consistent format
 */

const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  blue: '\x1b[34m'
};

const logLevel = process.env.LOG_LEVEL || 'info';
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const shouldLog = (level) => logLevels[level] <= logLevels[logLevel];

const formatTime = () => new Date().toISOString();

export const logger = {
  error: (message, data = {}) => {
    if (shouldLog('error')) {
      console.error(`${colors.red}[ERROR]${colors.reset} ${formatTime()} - ${message}`, data);
    }
  },

  warn: (message, data = {}) => {
    if (shouldLog('warn')) {
      console.warn(`${colors.yellow}[WARN]${colors.reset} ${formatTime()} - ${message}`, data);
    }
  },

  info: (message, data = {}) => {
    if (shouldLog('info')) {
      console.log(`${colors.blue}[INFO]${colors.reset} ${formatTime()} - ${message}`, data);
    }
  },

  debug: (message, data = {}) => {
    if (shouldLog('debug')) {
      console.log(`${colors.green}[DEBUG]${colors.reset} ${formatTime()} - ${message}`, data);
    }
  }
};

/**
 * Request logging middleware
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 400 ? colors.red : colors.green;

    logger.info(`${req.method} ${req.path} ${color}${status}${colors.reset} ${duration}ms`);
  });

  next();
};
