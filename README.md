# RiskRadar

This is the edited frontend exported from Bolt. You do not need Bolt tokens to work on it.

## Run locally

With Node.js and pnpm installed:

```
cp .env.example .env
pnpm install
pnpm dev --host 127.0.0.1
```

Add the current prediction API address to `.env` before starting the app. Never
commit `.env`; `.env.example` is the safe template for teammates.

Open the local address printed by the server. For checks: `pnpm test`, `pnpm typecheck`, `pnpm build`.

## Model connection

The `.env` file contains `VITE_SCAM_API_URL`, the temporary Cloudflare address.
If the Colab runtime/tunnel ends, replace that address with the new tunnel URL
and restart the development server (or rebuild for deployment).
The Python API and model stay in your separate backend repository.

## Changes in this revision

### Privacy, language and QR revision

- All six interface languages now cover navigation, scan instructions, Scam
  Academy lessons, privacy status, categories and analysis explanations.
- QR images can be uploaded and decoded locally with `jsQR`. The destination is
  displayed and checked without being opened; manual paste remains available.
- Each result visibly says whether processing was local or used the cloud model.
- Scans receive a local category and History can be filtered by category.
- Optional sender/source input enables local Report, Not Spam and RiskRadar-only
  Block actions. These do not block calls or texts at operating-system level.
- The Privacy dashboard shows local/cloud counts, reported senders, data export,
  and a two-step local delete control.
- Newly saved history redacts common OTP/PIN/password/card-number patterns and is
  capped at 1,200 characters. Existing older entries are not silently rewritten.
- Demo samples remain available on message and email checks and use the real
  analysis flow.

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
QR camera capture is not included; users upload an image or paste its destination.
URL checks are heuristics, not a live reputation service. Interface and rule
explanations are translated, but the trained model itself remains English-first.

History currently uses browser `localStorage`, not account sync or end-to-end
encrypted storage. Sender reports are local observations, not proof that a person
is fraudulent and are never published by this frontend.

The tunnel is temporary. Existing history entries retain their original results;
run a new check to see the corrected behavior. Use fictional examples for demos.
