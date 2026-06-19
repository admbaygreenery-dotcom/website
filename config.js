/* =================================================================
   Bay Greenery — Site configuration
   -----------------------------------------------------------------
   Change values here to update links across the whole site.
   No coding knowledge needed: replace the string in quotes and save.
   ================================================================= */

window.BAY_GREENERY_CONFIG = {
  /* The Google Form that customers fill out to book a service.
     Find this URL in Google Forms by clicking "Send" → link icon.
     Use the regular form link, NOT the "shortened" one. */
  bookingFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSfeggzXtM4JuPyvAyuPcIi4_ynukz8hmkh02rMgCoelk4eL6A/viewform',

  /* Public Google Business profile reviews tab — used by the "Read All Google Reviews" button.
     The `!1b1` segment in the URL opens straight to the reviews tab.
     Leave blank ('') to hide that button site-wide. */
  googleReviewsUrl: 'https://www.google.com/maps/place/Bay+Greenery/@37.3287405,-121.9446305,10z/data=!4m8!3m7!1s0xaf1c14edcf7a2ae7:0x6fa2b80ed1d68967!8m2!3d37.3287405!4d-121.9446305!9m1!1b1!16s%2Fg%2F11ykh7mqjj',

  /* Direct "leave a review" link — Google opens its review composer for your profile.
     Leave blank ('') to hide the "Leave a Review" button. */
  leaveReviewUrl: 'https://g.page/r/CWeJ1tEOuKJvEAI/review',

  /* Instagram profile. Leave blank ('') to hide the link. */
  instagramUrl: '',

  /* Google Analytics 4 measurement ID — e.g. 'G-XXXXXXXXXX'.
     Leave blank to disable analytics. */
  googleAnalyticsId: '',

  /* Phone, email and address used in the footer. */
  email: 'ops@baygreenery.com',
  phone: '(408) 454-8078',
  phoneTel: '+14084548078',
  serviceArea: ['South Bay', 'Peninsula'],

  /* Mailing address — shown under a "Mailing Address" subheader in the
     footer. Each array entry renders as its own line. */
  mailingAddress: [
    'Bay Greenery, LLC',
    '10080 N Wolfe Ave',
    'Suite SW3-200',
    'Cupertino, CA 95014',
  ],

  /* CA contractor license — displayed on hero + footer. */
  license: 'CA License C-27 #1146610',
  bondedAndInsured: 'Bonded and Insured',
};
