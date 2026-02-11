import { redirect } from 'next/navigation';

// Page temporairement masquée - redirection vers la page partenaires
export default function Page() {
  redirect('/devenir-partenaire');
}
