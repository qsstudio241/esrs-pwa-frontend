/* eslint-disable testing-library/prefer-screen-queries */
const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const tmpDir = path.join(__dirname, ".tmp");
const xlsxPath = path.join(tmpDir, "fs-sample.xlsx");

function makeFakeXlsx() {
  const content = "A,B,C\n1,2,3";
  return Buffer.from(content, "utf8");
}

test.beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(xlsxPath, makeFakeXlsx());
});

test("legacy FS: configure folder, upload via Galleria, show path", async ({
  page,
}) => {
  // Mock File System Access API
  await page.addInitScript(() => {
    class FakeWritable {
      async write(_) {}
      async close() {}
    }
    class FakeFileHandle {
      constructor(name) {
        this.name = name;
      }
      async createWritable() {
        return new FakeWritable();
      }
    }
    class FakeDirHandle {
      constructor(name) {
        this.name = name;
        this._dirs = new Map();
      }
      async queryPermission() {
        return "granted";
      }
      async requestPermission() {
        return "granted";
      }
      async getDirectoryHandle(name, opts = {}) {
        if (!this._dirs.has(name)) {
          if (opts.create) this._dirs.set(name, new FakeDirHandle(name));
          else throw new Error("NotFound");
        }
        return this._dirs.get(name);
      }
      async getFileHandle(name, _opts = {}) {
        return new FakeFileHandle(name);
      }
    }
    // Always return a fresh parent dir named 'Padre'
    window.showDirectoryPicker = async () => new FakeDirHandle("Padre");
  });

  await page.goto("/");

  // Create audit
  await page.getByText("Nuovo audit").click();
  await page.getByPlaceholder("Nome azienda").fill("FS Srl");
  await page.getByPlaceholder("Fatturato (EUR)").fill("3000000");
  await page.getByPlaceholder("Dipendenti").fill("45");
  await page.getByPlaceholder("Totale attivo (EUR)").fill("1200000");
  await page.getByRole("button", { name: "Crea" }).click();

  // Ensure legacy UI
  const toggle = page.getByLabel("Usa nuova checklist (beta)");
  if (await toggle.isChecked()) await toggle.click();

  // Configure audit folder (mocked)
  const newAuditBtn = page.getByRole("button", {
    name: "🆕 Nuovo Audit - Seleziona Cartella Padre",
  });
  await expect(newAuditBtn).toBeVisible();
  await newAuditBtn.click();

  // Status text can vary; we proceed to upload and verify path rendering

  // Upload via Galleria on first item
  const galleryBtn = page.getByRole("button", { name: "📁 Galleria" }).first();
  const [chooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    galleryBtn.click(),
  ]);
  await chooser.setFiles(xlsxPath);

  // In FS mode, legacy UI shows a button with the file name and a path line
  // Wait for path line to appear, then check the filename is visible
  await expect(page.getByText("Percorso:")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^(?:fs-sample\.xlsx)$/ })
  ).toBeVisible();
});
