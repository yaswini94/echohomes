import { describe, it, expect, vi } from "vitest";
import i18n from "./i18n"; // Assuming the file is named i18n.js
import translationEN from "./locales/en/translation.json";
import translationES from "./locales/es/translation.json";
import translationZH from "./locales/zh/translation.json";

// Partial mock of i18next using importOriginal
vi.mock("i18next", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockImplementation(function (options) {
      this.language = options.lng;
      this.options = options;
    }),
    t: vi.fn((key) => {
      const resources = {
        en: translationEN,
        es: translationES,
        zh: translationZH,
      };
      const lang = i18n.language;
      return resources[lang].translation[key] || key;
    }),
  };
});

describe("i18n initialization", () => {
  it("should initialize i18n with the default language as English", () => {
    // Check that i18n was initialized with English as the default language
    expect(i18n.language).toBe("en");
  });

  it("should contain English, Spanish, and Chinese translations", () => {
    const resources = i18n.options.resources;

    // Check if English translations are available
    expect(resources.en.translation).toEqual(translationEN);

    // Check if Spanish translations are available
    expect(resources.es.translation).toEqual(translationES);

    // Check if Chinese translations are available
    expect(resources.zh.translation).toEqual(translationZH);
  });

  it("should switch to Spanish when language is set to 'es'", async () => {
    await i18n.changeLanguage("es");
    expect(i18n.language).toBe("es");
  });

  it("should switch to Chinese when language is set to 'zh'", async () => {
    await i18n.changeLanguage("zh");
    expect(i18n.language).toBe("zh");
  });

  it("should translate keys correctly based on the selected language", async () => {
    // Ensure 'hello' key exists in the translation JSON files

    // Set language to English and check translation
    await i18n.changeLanguage("en");
    expect(i18n.t("home")).toBe(translationEN.home);

    // Set language to Spanish and check translation
    await i18n.changeLanguage("es");
    expect(i18n.t("home")).toBe(translationES.home);

    // Set language to Chinese and check translation
    await i18n.changeLanguage("zh");
    expect(i18n.t("home")).toBe(translationZH.home);
  });
});
