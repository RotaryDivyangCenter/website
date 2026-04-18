import { SITE_URL } from './seo';

export default function Head() {
  return (
    <>
      <meta property="og:logo" content={`${SITE_URL}/logo-circular.png`} />
    </>
  );
}
