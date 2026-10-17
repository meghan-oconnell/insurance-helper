// data/plan.js
// Every fact here must be checked by a person against the PDF before reviewed: true.
// Each quote must appear on ONE line of plan.txt, or isVerified will reject it.
const doc = "KP_DC_Silver_3500.pdf"; // ← change to your PDF's actual file name

export default {
  id: "kp-dc-silver-3500-2026",
  name: "KP DC Silver 3500 Ded/1200 RxDed/Vision",
  year: 2026,
  factsByScenario: {
    mri: {
      service_cost: {
        value:
          "30% coinsurance for imaging (CT/PET scans, MRIs) from a plan provider. Not covered from a non-plan provider.",
        reviewed: true,
        source: {
          id: "imaging-cost",
          document: doc,
          page: 2,
          quote: "Imaging (CT/PET 30% coinsurance",
        },
      },
      deductible_rule: {
        value:
          "The 30% applies after you meet your deductible ($3,500 individual / $7,000 family). Until then, you generally pay the full cost.",
        reviewed: true,
        source: {
          id: "deductible-applies",
          document: doc,
          page: 2,
          quote:
            "All copayment and coinsurance costs shown in this chart are after your deductible has been met, if a deductible applies.",
        },
      },
      referral_rule: {
        value:
          "You need a referral before seeing a specialist, but you may self-refer to certain specialists.",
        reviewed: true,
        source: {
          id: "referral-rule",
          document: doc,
          page: 1,
          quote: "Yes, but you may self-refer to certain",
        },
      },
    },
  },
};
