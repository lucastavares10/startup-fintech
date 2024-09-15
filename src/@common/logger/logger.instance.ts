import { Logger, transports, format } from 'winston';
import { ENV_VARS } from '../constants';

export function addWinstonLoggerInstance(
  winstonInstance: Logger,
  environment: string,
  appName: string,
) {
  if (environment === ENV_VARS.LOCAL) {
    winstonInstance.add(
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp(),
          format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'context'],
          }),
          format.printf(
            ({ timestamp, level, message, context, metadata }) =>
              `${timestamp} [${context}] ${level}: ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : ''}`,
          ),
        ),
      }),
    );
  } else {
    winstonInstance.add(
      new transports.File({
        filename: `/var/log/${appName}.log`,
        maxsize: 40 * 1000000,
        maxFiles: 1,
        tailable: true,
        format: format.combine(
          format.timestamp(),
          format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'context'],
          }),
          format.json(),
        ),
      }),
    );
  }
}
