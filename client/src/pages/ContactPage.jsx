const HOURS = [
  ['Monday – Thursday', '11:00am – 9:00pm'],
  ['Friday', '11:00am – 10:00pm'],
  ['Saturday', '10:00am – 10:00pm'],
  ['Sunday', '10:00am – 8:00pm'],
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-extrabold text-brand-ink">Visit Us</h1>
      <p className="mt-4 text-lg text-brand-ink/70">
        Orders are placed at the counter — walk in, tell us what you want, and we will call your name.
      </p>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-gold">Opening hours</h2>
          <table className="mt-4 w-full text-left text-sm">
            <tbody>
              {HOURS.map(([day, time]) => (
                <tr key={day} className="border-b border-brand-ink/10 last:border-0">
                  <th scope="row" className="py-2 pr-4 font-medium text-brand-ink">
                    {day}
                  </th>
                  <td className="py-2 text-brand-ink/70">{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-gold">Find us</h2>
          <address className="mt-4 not-italic text-brand-ink/75">
            18 Oxford Street
            <br />
            Osu, Accra
            <br />
            Ghana
          </address>
          <p className="mt-4 text-brand-ink/75">
            Phone: <span className="font-medium text-brand-ink">+233 (0) 30 000 0000</span>
          </p>
          <p className="text-brand-ink/75">
            Email: <span className="font-medium text-brand-ink">hello@trinekitchen.example</span>
          </p>
        </section>
      </div>
    </div>
  );
}
