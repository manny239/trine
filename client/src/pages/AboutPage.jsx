import { usePageTitle } from '../hooks/usePageTitle';

const SECTIONS = [
  {
    title: 'Food as heritage',
    body: 'Ghanaian cooking is a living archive of cultural heritage — recipes passed down through generations, carried from grandmother to mother to daughter. Every pot we put on the fire follows a method someone taught us, not a shortcut we invented.',
  },
  {
    title: 'Built on staples',
    body: 'Cassava, maize, yams, and plantains form the backbone of the kitchen. They are pounded into fufu, fermented into banku and kenkey, grated into gari, and fried into kelewele — one ingredient, many transformations.',
  },
  {
    title: 'Eaten together, by hand',
    body: 'Much of this food is meant to be shared from a common bowl and eaten with the right hand: pinch off a piece of fufu, shape it, scoop the soup. It is a way of eating that keeps people at the table longer.',
  },
  {
    title: 'Coast to north',
    body: 'Ghana is not one cuisine but many. The coast leans on the sea — grilled tilapia, fried fish, shito. The north leans on grains — tuo zaafi with ayoyo soup, thicker and spicier groundnut stews. We cook across that range.',
  },
];

export default function AboutPage() {
  usePageTitle('Our story');
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-brand-ink">Our Story</h1>
      <p className="mt-4 text-lg text-brand-ink/70">
        Trine Kitchen cooks Ghanaian food the way it is cooked at home — slowly, generously, and
        without apology for the pepper.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <section key={section.title} className="rounded-2xl bg-white/60 p-6 ring-1 ring-brand-ink/10">
            <h2 className="text-xl font-bold text-brand-red">{section.title}</h2>
            <p className="mt-3 text-brand-ink/75">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
