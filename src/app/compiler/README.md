# Pasta `compiler`

Esta pasta centraliza a lógica de integração com serviços de compilação e execução de código, como o Judge0.

- **Responsabilidade:**
  - Adaptadores para diferentes "motores" de execução (Judge0, Docker, etc)
  - Utilitários para submissão, polling e parsing de resultados
  - Futuras integrações com outros compiladores/sandboxes

> Inicialmente, será usada para a integração com o Judge0 (self-hosted). 