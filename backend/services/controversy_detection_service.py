"""Trust verification helpers for comparing report claims with ground feedback.

This module keeps the product vocabulary explicit: report claims and ground
feedback are compared, and conflicts become contested claims requiring manual
verification. The implementation currently uses deterministic fallback rules so
the workflow works without a model key.
"""

from services.verification_service import (
    build_lender_trust_report,
    detect_controversies,
    make_reference_number,
)

