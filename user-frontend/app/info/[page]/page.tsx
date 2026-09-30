import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const pages: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  about: {
    title: "About Food24KH",
    sections: [
      { heading: "Our mission", body: "Food24KH helps people across Cambodia order from the local restaurants and shops they love — quickly, fairly and in their own language." },
      { heading: "What the name means", body: "Food for our marketplace, 24 for ordering whenever you need it, and KH for Cambodia and the Khmer community we serve." },
      { heading: "Local first", body: "We support English and Khmer, US dollars and riel, and we work with independent Cambodian businesses as well as larger brands." },
    ],
  },
  help: {
    title: "Help centre",
    sections: [
      { heading: "Where is my order?", body: "Open Orders from the menu to see the latest status of each order. Status updates come directly from the restaurant." },
      { heading: "Can I cancel?", body: "You can cancel an order while it is still pending. Once the restaurant confirms, please contact the restaurant." },
      { heading: "Paying in riel", body: "Choose KHR under Language & currency in your account. Prices are converted using the platform's configured rate." },
      { heading: "Vouchers", body: "Enter a voucher code at checkout. Each voucher shows its minimum order and maximum discount." },
    ],
  },
  terms: {
    title: "Terms & conditions",
    sections: [
      { heading: "Draft terms", body: "These terms are a placeholder for development and are not legally binding. Final terms will be published before Food24KH launches." },
      { heading: "Orders", body: "Orders are accepted by the individual restaurant or shop. Final prices and totals are confirmed by Food24KH's servers at checkout." },
    ],
  },
  privacy: {
    title: "Privacy policy",
    sections: [
      { heading: "Draft policy", body: "This policy is a development placeholder. In the current demo, your cart, addresses and orders are stored only in this browser." },
      { heading: "Your data", body: "Food24KH will never sell your personal data. Passwords are never stored in plain text." },
    ],
  },
};

type Props = { params: Promise<{ page: string }> };

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const content = pages[page];
  return content ? { title: content.title, alternates: { canonical: `/info/${page}` } } : { title: "Not found" };
}

export default async function InfoPage({ params }: Props) {
  const { page } = await params;
  const content = pages[page];
  if (!content) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl font-extrabold">{content.title}</h1>
      <div className="mt-8 space-y-6">
        {content.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">{section.heading}</h2>
            <p className="mt-2 leading-7 text-muted">{section.body}</p>
          </section>
        ))}
      </div>
      <Link href="/" className="mt-8 inline-block font-semibold text-primary hover:underline">
        ← Back to Food24KH
      </Link>
    </article>
  );
}
