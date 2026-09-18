# Deploying Nessie internally at your school

This guide explains how to publish Nessie as a Google Workspace add-on for a whole school, with a single Gemini API key held by the IT team. Teachers install the add-on and use the tool without creating a key of their own.

If you only want to try Nessie out, you do not need any of this: make a copy of the template document and paste your key into Settings.

## Choosing a format

| | Document copy | Internal add-on |
|---|---|---|
| Who provides the key | Each teacher, their own | The school, a single key |
| Installation | Make a copy of the document | Installed by the administrator for the domain |
| Where it works | Only in copies of that document | In any document the teacher opens |
| Updating the code | Every copy has to be rebuilt | One new version reaches everyone |
| Who maintains it | The teacher | The IT team |
| Google Cloud project required | No | Yes |

The document-copy format is still the one to use for public distribution. The internal add-on makes sense when a school wants a single tool for everyone, wants to avoid every teacher creating a key, and wants to control updates centrally.

**Never publish an instance with a shared key in public mode on the Marketplace.** Anyone who installed it would consume, and exhaust, your school's quota.

## Before you start

You will need:

- An account with Google Workspace administrator privileges.
- Permission to create a Google Cloud project inside your organisation.
- About an hour for the first deployment.
- Ideally, billing enabled on the Cloud project. The free tier of the Gemini API has per-minute and per-day limits that apply to the whole key, not to each teacher.

---

## Step 1. Create the school key

1. Go to https://aistudio.google.com/apikey and create the key inside a Google Cloud project owned by the organisation, not a personal project.
2. In Google Cloud, open APIs & Services → Credentials, find the key and restrict it: under API restrictions, leave only the **Generative Language API**. IP and referrer restrictions do not apply to Apps Script.
3. Record who has access to the key. Treat it as an institutional password.

If your school already uses Google Cloud, it is worth creating a dedicated project, for example `nessie-school`, to keep quota and billing separate.

## Step 2. Prepare the Apps Script project

1. Create a new Apps Script project (or duplicate your internal one) and add all the Nessie files.
2. In `config.js`, turn the shared key on:

   ```javascript
   SHARED_KEY_ENABLED: true,
   ```

   This is the only file that differs from the public version. Keep it `false` in any project you distribute for copying.

3. In Project Settings → Script Properties, create:

   | Property | Value |
   |---|---|
   | `NESSIE_SHARED_API_KEY` | the key created in step 1 |

   Do not put the key in any `.js` file, so that it never reaches version control.

4. In the editor, run `checkSharedApiKey()` once. It should report `Teste de conexão: OK` along with the masked key. If it reports an empty value, the property was saved in the wrong place.

A teacher's personal key, when one exists, takes priority over the school key. Teachers who already used Nessie with their own key stay on their own quota, and everyone else uses the school key without configuring anything.

## Step 3. Link a Google Cloud project

The Marketplace requires a standard Cloud project. The one Apps Script creates automatically will not work.

1. In Google Cloud, select the school project and copy the project number (not the project ID).
2. In Apps Script, go to Project Settings → Google Cloud Platform (GCP) Project, click Change project and paste the number.
3. In Cloud, open APIs & Services → Library and enable the **Google Workspace Marketplace SDK**.
4. In APIs & Services → OAuth consent screen, set the app to **Internal**. Fill in the app name, support email and developer email.

With the consent screen set to Internal, only accounts in your domain can authorise the add-on.

## Step 4. Deploy a version

1. In Apps Script, click Deploy → New deployment.
2. For the type, choose **Editor Add-on**.
3. Give it a description, for example `Nessie 2.1.0`, and deploy.
4. Copy the script ID from Project Settings and note the version number that was just created.

Every code change requires a new deployment and an updated version number in the next step. Without that, teachers keep running the old code.

## Step 5. Configure the Marketplace SDK

In Google Cloud, open APIs & Services → Google Workspace Marketplace SDK.

**On the App Configuration tab:**

- App visibility: **Private**, restricted to your domain.
- Installation settings: **Admin-only install** if you want to roll it out to everyone, or **Individual install** if you prefer teachers to choose.
- Under App Integration, tick **Docs add-on** and enter the script ID and version number from step 4.
- Under OAuth scopes, list exactly the three scopes from `appsscript.json`:

  ```
  https://www.googleapis.com/auth/documents.currentonly
  https://www.googleapis.com/auth/script.container.ui
  https://www.googleapis.com/auth/script.external_request
  ```

  Any mismatch between this list and the manifest makes installation fail.

**On the Store Listing tab**, even for a private app, fill in the name, short description, detailed description, category, language, a 128 by 128 pixel icon, at least one screenshot, and the support, terms and privacy links. An internal Google Doc published to the web works as a privacy policy link.

For the icon, export the Nessie logo: the SVG lives in `Index.html`, in the sidebar header, and any image editor can convert it to PNG.

Click Publish. Because the app is internal, there is no Google review and publication is immediate.

## Step 6. Install it for the school

If you chose admin-only install:

1. In the Admin console, go to Apps → Google Workspace Marketplace → Apps list.
2. Click Add app → Internal apps and select Nessie.
3. Choose whether to install for the whole organisation or only for specific organisational units, for example the teaching staff.
4. Accept the permissions on behalf of the domain.

Ask teachers to reload any open document. The Nessie menu appears in the menu bar and the sidebar works straight away, with no key prompt.

---

## After publishing

**Rotating the key.** Edit the `NESSIE_SHARED_API_KEY` property and run `checkSharedApiKey()`. No new deployment and no reinstallation are needed.

**Updating the code.** Deploy a new version in Apps Script and update the version number in the Marketplace SDK. Teachers get the update the next time they open a document.

**Monitoring usage.** In Google Cloud, under APIs & Services → Dashboard, the Generative Language API shows request volume and errors. That is where to check whether quota is running tight.

**Revoking access.** To switch everything off at once, run `clearSharedApiKey()` or delete the key in Cloud. The add-on stays installed, and the features that do not use AI, such as highlight punctuation and the audio reader, keep working.

## Common problems

| Symptom | Likely cause |
|---|---|
| Installation fails with a scope error | The scope list in the Marketplace SDK does not match `appsscript.json`. |
| The Nessie menu does not appear | The document has to be reloaded after installation. |
| The sidebar asks for a key even though the property exists | `SHARED_KEY_ENABLED` is still `false`, or the property was saved in a different project. Run `checkSharedApiKey()` to confirm. |
| "API usage limit reached" during lesson time | The free quota is shared across the whole school. Enable billing on the Cloud project. |
| Teachers see the menu in the default language | The menu is built before authorisation, and the default language is used at that moment. It corrects itself when the document is reloaded. |
| New code does not reach teachers | The version number in the Marketplace SDK was not updated after deployment. |

## Security checklist

- [ ] The key is only in Script Properties, never in a file in the repository.
- [ ] The key is restricted to the Generative Language API.
- [ ] App visibility in the Marketplace is private, restricted to the domain.
- [ ] The OAuth consent screen is set to Internal.
- [ ] Edit access to the Apps Script project is limited to the IT team, since anyone who can edit the project can read the key.
- [ ] The project you distribute publicly, for copying, has `SHARED_KEY_ENABLED: false` and no key property.
