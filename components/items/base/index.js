export default function List({ items, children }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 px-5 lg:px-8 xl:px-16 gap-4 lg:gap-8 pb-4  bg-black">
      {items.map(item => children(item))}
    </section>
  );
}
