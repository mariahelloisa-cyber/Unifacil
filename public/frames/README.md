# Frames da intro (preloader)

Coloque aqui as imagens da sequência de abertura da página /institucional.

Nomes esperados (é só sobrescrever os arquivos, sem mexer em código):

    frame-01.jpg … frame-08.jpg

Os arquivos que estão aqui agora são PLACEHOLDERS (cópias de fotos que já
existiam em /public/images) só para a animação rodar de cara.

Recomendações:
- JPG, ~1600px de largura, 120–250 KB cada;
- enquadramento com folga: a exibição é `object-fit: cover` na viewport
  inteira, então as bordas são cortadas em telas muito largas ou estreitas;
- todas são baixadas antes da sequência começar — quanto mais leves, mais
  rápido o site aparece.

Para usar outra quantidade de frames, outros nomes, outros textos ou outros
tempos, edite a constante `SEQUENCIA` em:

    components/intro/IntroAnimation.tsx
