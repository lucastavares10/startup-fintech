const { env } = process;

export const variables = (): any => {
  return {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
  };
};
