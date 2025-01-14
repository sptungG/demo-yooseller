import { useRouter } from "next/router";
import { useMemo } from "react";
import { en } from "src/types/i18n/en";
import { ko } from "src/types/i18n/ko";
import { vi } from "src/types/i18n/vi";

export default function useChangeLocale() {
  const { locale, replace } = useRouter();
  const i18nObj = useMemo(() => {
    if (locale === "en") return en;
    if (locale === "ko") return ko;
    return vi;
  }, [locale]);
  return { locale, i18n: i18nObj };
}
