// Site settings. Facts that appear on several pages live here so they change in one place.

export default {
  siteName: 'No Alumni',

  // Where the site is served from.
  // Preview (now): GitHub's project address, https://mattlafleur-cle.github.io/noalumni-site/, so every link
  // carries the /noalumni-site prefix. At switch-over to www.noalumni.com, set basePath to '' and
  // canonicalDomain to 'https://www.noalumni.com', and add the custom domain in Settings > Pages.
  basePath: '/noalumni-site',
  canonicalDomain: null,

  // Search indexing stays OFF during the preview so it never competes with the live Wix site.
  // Every page carries noindex until this is true (which requires canonicalDomain).
  allowIndexing: false,

  tagline: 'A national community and movement celebrating every path to success, and helping teams and organizations thrive.',

  booking: {
    call: 'https://fantastical.app/mattlafleur/new-game-readiness-assessment', // "Schedule a quick call" on the Wix home page
    intro: 'https://fantastical.app/mattlafleur/no-alumni-intro', // the Wix /book-online page forwards here
  },

  contact: {
    email: 'connect@noalumni.com',
    phone: '216-550-4689',
  },

  shopUrl: 'https://noalumni.shop/',
  eventsUrl: 'https://www.eventbrite.com/o/no-alumni-121363530237',
  workingGeniusAssessmentUrl: 'https://myformflow.io/no-alumni/workinggenius',
  trustpilotUrl: 'https://www.trustpilot.com/review/noalumni.com',

  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/share/1G2vV5yt9T/?mibextid=wwXIfr' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/no-alumni/' },
    { name: 'YouTube', url: 'https://www.youtube.com/@NewGameOldGame' },
    { name: 'Spotify', url: 'https://open.spotify.com/show/6qaP0hZ1FRLQagyIPeHW8x' },
    { name: 'Apple Podcasts', url: 'https://podcasts.apple.com/us/podcast/new-game-old-game/id1862546674' },
  ],

  // Short links kept from the Wix site. Each becomes a tiny noindex page that forwards to the target.
  // GitHub Pages paths are case-sensitive, so printed event links get an uppercase alias too.
  redirects: [
    { from: 'jma', to: 'https://results.noalumni.com/jma/start' },
    { from: 'JMA', to: 'https://results.noalumni.com/jma/start' },
    { from: 'ppa', to: 'https://results.noalumni.com/ppa/start' },
    { from: 'PPA', to: 'https://results.noalumni.com/ppa/start' },
    { from: 'commodore', to: 'https://results.noalumni.com/commodore/' },
    { from: 'book-online', to: 'https://fantastical.app/mattlafleur/no-alumni-intro' },
    // Retired Wix pages: send old links somewhere useful instead of a dead end.
    { from: 'copy-of-view-merch', to: '/shop/' },
    { from: 'individual-join', to: '/contact-us/' },
    { from: 'individualjoin', to: '/contact-us/' },
    { from: 'business-join', to: '/contact-us/' },
    { from: 'businessjoin', to: '/contact-us/' },
    { from: 'employer-join', to: '/contact-us/' },
    { from: 'employerjoin', to: '/contact-us/' },
  ],
};
