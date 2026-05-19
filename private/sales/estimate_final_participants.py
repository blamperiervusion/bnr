#!/usr/bin/env python3
"""
Estimation du nombre de participants finaux (2026) à partir des courbes 2024–2025
et de l'export 2026 courant. Réutilise la même logique de nettoyage que analyze_sales.py.
"""

from pathlib import Path

import pandas as pd

SALES_DIR = Path(__file__).parent

# Aligné sur analyze_sales.py
FILES_2024 = "export-barb-n-rock-festival-2024-association-crepicordienne-pour-la-promotion-de-la-culture-.csv"
FILES_2025 = "export-barb-n-rock-festival-2025-association-crepicordienne-pour-la-promotion-de-la-culture-.csv"
FILE_2026 = "export-barb-n-rock-festival-2026-association-crepicordienne-pour-la-promotion-de-la-culture-acpc-05_12_2025-18_05_2026.xlsx"

EXCLUDED_TARIFS = [
    "Prévente Cashless",
    "Cashless",
    "Réservation Camping",
    "Camping Cars",
]
EXCLUDED_BUYERS = ["Saverglass"]


def is_ticket(tarif: str) -> bool:
    t = str(tarif).lower()
    for ex in EXCLUDED_TARIFS:
        if ex.lower() in t:
            return False
    return True


def get_participant_count(tarif: str) -> int:
    t = str(tarif).lower()
    if "3 jours" in t or "pack 3" in t or "pass 3" in t:
        return 3
    if (
        "2 jours" in t
        or "& dimanche" in t
        or "& dimance" in t
        or "& samedi" in t
        or "samedi &" in t
        or "vendredi &" in t
    ):
        return 2
    return 1


def is_excluded_buyer(row: pd.Series) -> bool:
    n1 = str(row.get("Nom participant", "")).lower()
    n2 = str(row.get("Nom payeur", "")).lower()
    for e in EXCLUDED_BUYERS:
        if e.lower() in n1 or e.lower() in n2:
            return True
    return False


def process(df: pd.DataFrame) -> pd.DataFrame:
    df = df[df["Statut de la commande"] == "Validé"].copy()
    df = df[df["Tarif"].apply(is_ticket)]
    df = df[~df.apply(is_excluded_buyer, axis=1)]
    df["participants"] = df["Tarif"].apply(get_participant_count)
    df["date"] = pd.to_datetime(df["Date de la commande"], format="%d/%m/%Y %H:%M")
    return df


def main():
    d24 = process(pd.read_csv(SALES_DIR / FILES_2024, sep=";", encoding="utf-8"))
    d25 = process(pd.read_csv(SALES_DIR / FILES_2025, sep=";", encoding="utf-8"))
    d26 = process(pd.read_excel(SALES_DIR / FILE_2026))

    fin24 = d24["participants"].sum()
    fin25 = d25["participants"].sum()

    last_2026 = d26["date"].max()
    # Même position calendrique (Mois-Jour) que la dernière commande 2026
    anchor_2024 = last_2026.replace(year=2024)
    anchor_2025 = last_2026.replace(year=2025)
    cum24 = d24[d24["date"] <= anchor_2024]["participants"].sum()
    cum25 = d25[d25["date"] <= anchor_2025]["participants"].sum()
    cum26 = d26["participants"].sum()

    r24 = fin24 / cum24 if cum24 else float("inf")
    r25 = fin25 / cum25 if cum25 else float("inf")
    p24 = cum26 * r24
    p25 = cum26 * r25
    w25, w24 = 0.7, 0.3
    p_mix = cum26 * (w25 * r25 + w24 * r24)

    print("=" * 60)
    print("  Estimation participants finaux — Barb'n'Rock 2026")
    print("=" * 60)
    print(f"\nDernière commande dans l'export 2026 : {last_2026}")
    print(f"Participants (hors options/cashless) pris en compte : {cum26:.0f}\n")
    print(f"À la même date calendaire (année témoin) :")
    print(f"  2024 : {cum24:.0f} pax → final {fin24:.0f}  (ratio ×{r24:.2f})")
    print(f"  2025 : {cum25:.0f} pax → final {fin25:.0f}  (ratio ×{r25:.2f})")
    print()
    print("Projections (participants) :")
    print(f"  — Méthode 2024 (dynamique d’ouverture billetterie plus “lente”)  : ≈ {p24:.0f}")
    print(f"  — Méthode 2025 (même dispositif Very Early / Early, plus comparable) : ≈ {p25:.0f}")
    print(f"  — Moyenne pondérée (0,7 × 2025 + 0,3 × 2024)            : ≈ {p_mix:.0f}")
    print()
    print("Fourchette raisonnable (entre les deux extrêmes) :")
    print(f"  {min(p24, p25):.0f} – {max(p24, p25):.0f} participants\n")
    print("Note : 2024 avait peu de ventes à date au printemps ; 2025 l’emporte en")
    print("comparabilité. L’objectif de 3 000 pax reste atteignable si le pic")
    print("d’été (plein tarif, last minute) se rapproche de 2025.\n")


if __name__ == "__main__":
    main()
