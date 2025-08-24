export function FooterCTA() {
  return (
    <div>
      {/* Your CTA content */}
<section
        id="contact"
        className="relative py-24 text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${ctaImageUrl})` }}
        >
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Craft Your Belize Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tell us your dream, and our concierge team will bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BuildMyTripButton>
                <Button variant="default" size="lg" className="text-lg px-8 py-6 font-semibold bg-white text-primary hover:bg-white/90">
                  <Wand2 className="h-5 w-5 mr-2" />
                  Build My Trip
                </Button>
              </BuildMyTripButton>
              <Button
                variant="secondary"
                size="lg"
                className="text-lg px-8 py-6 font-semibold bg-white/90 text-secondary-foreground hover:bg-white"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
         </div>
  );
}
