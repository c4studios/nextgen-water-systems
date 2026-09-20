# Perth water: primary sources for the resources pages

Researched 18 Sep 2026 for the articles under `/resources/`, the servicing page and the about page. Every fact below was checked against the live page text or the PDF's own text; quotes are verbatim. Only primary sources: Water Corporation, WA Health (HealthyWA and health.wa.gov.au), NHMRC (Australian Drinking Water Guidelines, ADWG), WA Building and Energy, WA legislation, and the ABCB. Nothing here comes from a retailer or a blog.

**The one to read first.** On 15 April 2025 Water Corporation issued *Warning issued over false health claims by water filtration companies*, in which WA's Chief Health Officer says "people do not need to spend thousands on water filtration systems" (https://www.watercorporation.com.au/about-us/media-releases/2025/april/warning-issued-over-false-health-claims-by-water-filtration-companies). The pages make no health-risk claim about scheme water. They talk about taste, smell and scale, which is what the product is for.

"AR" below is Water Corporation, *Drinking Water Quality Annual Report 2024-25* (ISSN 2202-879X), covering 1 July 2024 to 30 June 2025: https://pw-cdn.watercorporation.com.au/-/media/watercorp/documents/about-us/our-performance/drinking-water-quality/drinking-water-quality-annual-report-2024-25.pdf (index page: https://www.watercorporation.com.au/about-us/our-performance/drinking-water-quality). No printed date; PDF metadata last modified 16 July 2026. "This is our 23rd Drinking Water Quality Annual Report".

## Where Perth's water comes from

- 2024-25 source mix for the Integrated Water Supply Scheme: "13.8 per cent surface water, 41.5 per cent desalinated seawater, and 43.6 per cent groundwater" (AR p. 16). The three add to 98.9%.
- Desalination plants at Kwinana and near Binningup (AR p. 17).
- An undated Water Corporation page gives a different, unyeared mix; not used.

## Disinfection and the chlorine taste

- "All our drinking water supply schemes are disinfected with chlorine to protect us against waterborne pathogenic microorganisms." (AR p. 33)
- Chloramine is used on the Goldfields and Agricultural Water Supply: "Monochloramine is a longer lasting disinfectant, compared to chlorine alone" (AR p. 33). No published list of Perth suburbs on chloramine was found.
- Water Corporation, *Taste and smell* (undated): "The reaction of natural organic compounds with chlorine causes this taste and smell. We add chlorine to all water supply sources to prevent contamination." https://www.watercorporation.com.au/Help-and-advice/Water-issues/Water-quality/Taste-and-smell
- WA Health, *Chlorinated drinking water* (last reviewed 3 June 2022): "Negative (adverse) health effects have not been seen in people drinking water chlorinated." and "Normal chlorine concentrations in scheme drinking water supplies in Western Australia usually range from 0.5 to 1.5 milligrams per litre." https://www.health.wa.gov.au/Articles/A_E/Chlorinated-drinking-water
- ADWG chlorine fact sheet (endorsed 2014; guidelines version 4.0, June 2025): "Based on health considerations, the guideline value for total chlorine in drinking water is 5 mg/L." / "Chlorine has an odour threshold in drinking water of about 0.6 mg/L, but some people are particularly sensitive and can detect amounts as low as 0.2 mg/L." / "Water authorities may need to exceed the odour threshold value of 0.6 mg/L in order to maintain an effective disinfectant residual." https://guidelines.nhmrc.gov.au/australian-drinking-water-guidelines/part-5/physical-chemical-characteristics/chlorine

## Hardness

- AR p. 39: "Hardness is caused by the presence of dissolved calcium and magnesium in water. Hard water requires more soap to obtain lather and can also cause scale to form on hot water pipes and fittings. … The ADWG specify an aesthetic hardness guideline of 200 mg/L."
- AR Table 1 (ADWG guidance, degrees of hardness): under 60 mg/L "Soft and possibly corrosive"; 60 to 200 "Good quality for all domestic uses"; 200 to 500 "Will increase scale formation"; over 500 "Will cause a high-level scaling".
- ADWG hardness fact sheet (endorsed 1996; guidelines version 4.0, June 2025): "To minimise undesirable build-up of scale in hot water systems, total hardness (as calcium carbonate) in drinking water should not exceed 200 mg/L." https://guidelines.nhmrc.gov.au/australian-drinking-water-guidelines/part-5/physical-chemical-characteristics/hardness-as-calcium-carbonate
- Water Corporation, *Hard water* (undated): "Hard water may leave spots on drinking glasses, shower screens or garden plants because the minerals remain after the water has evaporated." It also says calcium and magnesium "cannot be removed by filtration". https://www.watercorporation.com.au/help-and-advice/water-issues/water-quality/hard-water
- **Per-area figures:** AR Appendix C, Table 4, *Aesthetic (non-health related) variables*, Perth Region, 1 July 2024 to 30 June 2025. Mean hardness (mg/L as CaCO3), minimum and maximum of the samples taken, by Water Corporation locality. Also published on its own: https://pw-cdn.watercorporation.com.au/-/media/watercorp/documents/about-us/our-performance/drinking-water-quality/dwq-annual-report-perth-aesthetic-tables.pdf. The localities are water-quality zones, not suburbs; the maps that tie them to suburbs are AR Appendix B. Transcribed into `src/content/perthWater.ts`; footnote (9) on Two Rocks: "Elevated hardness is characteristic of the source supplying this locality."

## Home filters, and who may work on them

- HealthyWA, *Water filters for your home* (last reviewed 17 March 2021): "It is not necessary to filter water from scheme drinking water supplies in Western Australia unless you live in an area where you may need to soften hard water." and "Some water filters may also allow bacteria to multiply to great levels on the filter pads if they are not maintained regularly." https://www.healthywa.wa.gov.au/Articles/U_Z/Water-filters-for-your-home
- WA Building and Energy, *Plumbing work in your home* (last updated 1 July 2026): homeowners may do a short list of jobs including "replacement of a water filter cartridge"; "Other than the above tasks all water supply, sanitary and drainage plumbing work must be carried out by a licensed plumber or permit-holder." https://www.wa.gov.au/organisation/building-and-energy/plumbing-work-your-home
- Water Corporation, *Leaking meter* (undated): "A licensed plumber is legally required to carry out any plumbing work that involves your water supply". https://www.watercorporation.com.au/Help-and-advice/Water-issues/Leaks/Leaking-meter

## Fluoride and PFAS (what this system does not do)

- HealthyWA, *Fluoride facts for Western Australia* (last reviewed 10 November 2025): "The optimum level for the Perth metropolitan area is 0.9 milligram per litre, with a range of 0.7 to 1.0 milligrams per litre." https://www.healthywa.wa.gov.au/Articles/F_I/Fluoride-facts-for-Western-Australia
- Water Corporation, *Monitoring for PFAS* (undated): "All scheme drinking water we supply is fully compliant with both the current and new draft guidelines (limits) for per-and poly-fluoroalkyl substances (PFAS)". https://www.watercorporation.com.au/about-us/our-performance/drinking-water-quality/monitoring-for-pfas . The page predates NHMRC finalising the limits on 25 June 2025; the results are statewide.

## WaterMark (not used on the site yet)

- ABCB: "WaterMark is a mandatory national product certification scheme for specified plumbing and drainage products". The WaterMark schedule lists "Water filters and water treatment appliances" (point of use and point of entry), certified to AS 3497:2021, and "if the product type is listed on the WaterMark Schedule of products, but is not WaterMark certified, a licensed plumber is not permitted to install it." https://www.abcb.gov.au/always-look-watermark
- Not on the site: the product's own WaterMark certificate has not been sighted (PRODUCT.md), so the pages say nothing about certification until it is.
