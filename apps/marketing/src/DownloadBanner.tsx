export default function DownloadBanner() {
  return (
    <section className="py-12 px-8">
      <div className="max-w-5xl mx-auto bg-ferro-tint border-2 border-ferro-primary rounded-2xl shadow-md px-10 py-12 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-3xl font-bold leading-tight text-ferro-ink">Start earning smarter today</h2>
          <p className="text-lg text-neutral-500 max-w-md">
            Join Ferro Maps and know where demand is highest before you drive there.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          <a
            href="#"
            className="inline-flex items-center justify-center bg-ferro-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-ferro-deep transition-colors duration-base whitespace-nowrap"
          >
            Download on the App Store
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center border-2 border-ferro-primary text-ferro-primary font-semibold px-6 py-3 rounded-xl hover:bg-ferro-tint transition-colors duration-base whitespace-nowrap"
          >
            Get it on Google Play
          </a>
        </div>
      </div>
    </section>
  )
}
