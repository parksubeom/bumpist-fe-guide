// Tailwind CSS v4는 전용 PostCSS 플러그인으로 붙는다.
// create-next-app을 --tailwind 옵션으로 만들었으면 이미 동일 파일이 있다(덮어써도 무방).
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
