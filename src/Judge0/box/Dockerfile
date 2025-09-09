FROM judge0/judge0:1.13.0

# Configurações específicas do ambiente
ENV JUDGE0_HOST=0.0.0.0
ENV JUDGE0_PORT=2358
ENV REDIS_URL=redis://redis:6379

# Expor a porta
EXPOSE 2358

# Comando para iniciar o Judge0
CMD ["rails", "server", "-b", "0.0.0.0", "-p", "2358"]







