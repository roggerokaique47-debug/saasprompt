import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  organizationId?: string;
  userId?: string;
  [key: string]: any;
}

export const logger = {
  log: (level: LogLevel, message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Log para console
    if (level === 'error') {
      console.error(formattedMessage, context || '');
    } else if (level === 'warn') {
      console.warn(formattedMessage, context || '');
    } else {
      console.log(formattedMessage, context || '');
    }

    // Se for erro ou warn e o Sentry estiver configurado, envia para o Sentry
    if ((level === 'error' || level === 'warn') && process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.withScope((scope) => {
        if (context?.organizationId) {
          scope.setTag('organizationId', context.organizationId);
        }
        if (context?.userId) {
          scope.setUser({ id: context.userId });
        }
        
        Object.entries(context || {}).forEach(([key, value]) => {
          if (key !== 'organizationId' && key !== 'userId') {
            scope.setExtra(key, value);
          }
        });

        if (level === 'error') {
          Sentry.captureException(new Error(message));
        } else {
          Sentry.captureMessage(message, 'warning');
        }
      });
    }
  },
  
  info: (message: string, context?: LogContext) => logger.log('info', message, context),
  warn: (message: string, context?: LogContext) => logger.log('warn', message, context),
  error: (message: string, context?: LogContext) => logger.log('error', message, context),
  debug: (message: string, context?: LogContext) => logger.log('debug', message, context),
};
