# RiskRadar

This is the edited frontend exported from Bolt. You do not need Bolt tokens to work on it.

## Run locally

With Node.js and pnpm installed:

```
pnpm install
pnpm dev --host 127.0.0.1
```

Open the local address printed by the server. For checks: `pnpm test`, `pnpm typecheck`, `pnpm build`.

## Model connection

The `.env` file contains `VITE_SCAM_API_URL`, the temporary Cloudflare address.
If the Colab runtime/tunnel ends, replace that address with the new tunnel URL
and restart the development server (or rebuild for deployment).
The Python API and model stay in your separate backend repository.

## Changes in this revision

### Layout and Academy revision

- Removed the extra logo above the supplied launch animation.
- Set the RR image as the favicon and Apple touch icon; replaced default share-image metadata.
- Removed the desktop promotional sidebar. Main content adapts to available width.
- Added Home / Scan / History / Learn / Profile navigation and preserved contact/settings access.
- Added eight Scam Academy lessons and a three-question simulator with feedback and reset.
- Google login and cross-device sync remain deferred. History is stored locally.

- Integrated the provided RR logo and original HTML phone/radar launch animation.
  Tap to play, skip at any point, or use reduced motion; launch runs once per session.
- Adapted the new Magic Patterns preview's blue cards and split desktop layout
  onto the working frontend. This is a visual adaptation, not an import of the
  Magic Patterns source. Demo sign-in/sync and fabricated history are not included.
- Recent checks and weekly counts come from actual local history.

- Screenshot upload now previews the image and extracts English text with Tesseract.js.
  Review/correct the text, then analyze. Previously it analyzed the filename only.
- Extracted screenshot text uses the same API and rules as pasted messages.
- Credential rules ignore negated instructions without suppressing other requests.
- Offline fallback is visible, and malformed model responses are rejected.
- Model scores are kept unchanged. Uncertain scores with no rule evidence receive
  an explanation rather than an invented reason or forced safe label.
- Visible branding is RiskRadar.

## Known limitations

The model was trained on English email. Its email test accuracy is not a measure
of accuracy on Indian SMS, advertisements, QR codes, or regional languages.
A benign SMS can still receive a moderate model score; this frontend fix does
not retrain or recalibrate the model. Local rule scores and model scores have
different meanings and are labeled separately.

OCR needs an internet connection on first use to load its language/worker assets.
Only reviewed text is submitted to the API; images are processed in the browser.
QR currently accepts pasted destination text, not camera scanning/image decoding.
URL checks are heuristics, not a live reputation service. New analysis explanations
are English; the existing language selector does not translate model results.

The tunnel is temporary. Existing history entries retain their original results;
run a new check to see the corrected behavior. Use fictional examples for demos.
