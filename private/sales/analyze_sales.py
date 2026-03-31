#!/usr/bin/env python3
"""
Analyse de l'évolution des ventes du Barb'N'Rock Festival (2023-2026)
Compte les participants et génère un graphique comparatif par semaine calendaire.
"""

import pandas as pd
import matplotlib.pyplot as plt
from pathlib import Path
from datetime import datetime

SALES_DIR = Path(__file__).parent

FILES = {
    2023: "export-barb-n-rock-festival-association-crepicordienne-pour-la-promotion-de-la-culture-acpc-.csv",
    2024: "export-barb-n-rock-festival-2024-association-crepicordienne-pour-la-promotion-de-la-culture-.csv",
    2025: "export-barb-n-rock-festival-2025-association-crepicordienne-pour-la-promotion-de-la-culture-.csv",
    2026: "export-barb-n-rock-festival-2026-association-crepicordienne-pour-la-promotion-de-la-culture-acpc-05_12_2025-28_03_2026.xlsx",
}

EXCLUDED_TARIFS = [
    "Prévente Cashless",
    "Cashless",
    "Réservation Camping",
    "Camping Cars",
]

EXCLUDED_BUYERS = [
    "Saverglass",
]


def is_ticket(tarif: str) -> bool:
    """Vérifie si le tarif correspond à un billet (pas une option ou cashless)."""
    tarif_lower = tarif.lower()
    for excluded in EXCLUDED_TARIFS:
        if excluded.lower() in tarif_lower:
            return False
    return True


def get_participant_count(tarif: str) -> int:
    """Retourne le nombre de participants pour un type de billet."""
    tarif_lower = tarif.lower()

    if "3 jours" in tarif_lower or "pack 3" in tarif_lower or "pass 3" in tarif_lower:
        return 3
    elif (
        "2 jours" in tarif_lower
        or "& dimanche" in tarif_lower
        or "& dimance" in tarif_lower
        or "& samedi" in tarif_lower
        or "samedi &" in tarif_lower
        or "vendredi &" in tarif_lower
    ):
        return 2
    else:
        return 1


def load_data(year: int) -> pd.DataFrame:
    """Charge les données d'une année."""
    filepath = SALES_DIR / FILES[year]
    if filepath.suffix == ".xlsx":
        df = pd.read_excel(filepath)
    else:
        df = pd.read_csv(filepath, sep=";", encoding="utf-8")
    df["year"] = year
    return df


def is_excluded_buyer(row: pd.Series) -> bool:
    """Vérifie si l'acheteur doit être exclu."""
    nom_participant = str(row.get("Nom participant", "")).lower()
    nom_payeur = str(row.get("Nom payeur", "")).lower()
    for excluded in EXCLUDED_BUYERS:
        if excluded.lower() in nom_participant or excluded.lower() in nom_payeur:
            return True
    return False


def process_year(df: pd.DataFrame, year: int) -> pd.DataFrame:
    """Traite les données d'une année et retourne les billets valides."""
    df_valid = df[df["Statut de la commande"] == "Validé"].copy()
    df_valid = df_valid[df_valid["Tarif"].apply(is_ticket)]
    df_valid = df_valid[~df_valid.apply(is_excluded_buyer, axis=1)]
    df_valid["participants"] = df_valid["Tarif"].apply(get_participant_count)
    df_valid["date"] = pd.to_datetime(df_valid["Date de la commande"], format="%d/%m/%Y %H:%M")
    df_valid["week"] = df_valid["date"].dt.isocalendar().week
    df_valid["year_order"] = df_valid["date"].dt.year
    return df_valid


def print_summary(results: dict):
    """Affiche le tableau récapitulatif."""
    print("\n" + "=" * 55)
    print("   Évolution des ventes Barb'N'Rock Festival")
    print("=" * 55)
    print(f"\n{'Année':<8}{'Billets':>10}{'Participants':>15}{'Évolution':>12}")
    print("-" * 45)

    prev_participants = None
    for year in sorted(results.keys()):
        data = results[year]
        billets = data["billets"]
        participants = data["participants"]

        if prev_participants is None:
            evolution = "-"
        else:
            pct = ((participants - prev_participants) / prev_participants) * 100
            evolution = f"{pct:+.1f}%"

        print(f"{year:<8}{billets:>10}{participants:>15}{evolution:>12}")
        prev_participants = participants

    print()


def print_detail_by_tarif(all_data: pd.DataFrame):
    """Affiche le détail par type de billet pour chaque année."""
    print("\n" + "=" * 55)
    print("   Détail par type de billet")
    print("=" * 55)

    for year in sorted(all_data["year"].unique()):
        df_year = all_data[all_data["year"] == year]
        print(f"\n--- {year} ---")

        tarif_stats = df_year.groupby("Tarif").agg({"participants": ["count", "sum"]}).reset_index()
        tarif_stats.columns = ["Tarif", "Billets", "Participants"]
        tarif_stats = tarif_stats.sort_values("Participants", ascending=False)

        for _, row in tarif_stats.iterrows():
            print(f"  {row['Tarif'][:45]:<47} {row['Billets']:>4} billets -> {row['Participants']:>4} participants")


def create_weekly_chart(all_data: pd.DataFrame, results: dict):
    """Crée le graphique avec courbes superposées par semaine calendaire (n-1 et n)."""
    plt.figure(figsize=(16, 8))

    colors = {2023: "#1f77b4", 2024: "#ff7f0e", 2025: "#2ca02c", 2026: "#d62728"}

    for edition_year in sorted(all_data["year"].unique()):
        df_edition = all_data[all_data["year"] == edition_year].copy()

        df_edition = df_edition.sort_values("date")

        def calc_relative_week(row):
            order_year = row["year_order"]
            week = row["week"]
            if order_year == edition_year:
                return week
            elif order_year == edition_year - 1:
                return week - 52
            else:
                return week - 104

        df_edition["relative_week"] = df_edition.apply(calc_relative_week, axis=1)

        weekly = df_edition.groupby("relative_week")["participants"].sum().reset_index()
        weekly = weekly.sort_values("relative_week")
        weekly["cumsum"] = weekly["participants"].cumsum()

        total = results[edition_year]["participants"]
        label = f"Édition {edition_year} ({total} participants)"

        plt.plot(
            weekly["relative_week"],
            weekly["cumsum"],
            marker="o",
            markersize=4,
            linewidth=2,
            color=colors[edition_year],
            label=label,
        )

    plt.axvline(x=0, color="gray", linestyle="--", alpha=0.5, label="1er janvier année n")
    plt.axvline(x=26, color="red", linestyle="--", alpha=0.5, label="~Festival (S26)")

    tick_positions = list(range(-12, 28, 4))
    tick_labels = []
    for w in tick_positions:
        if w < 0:
            tick_labels.append(f"n-1 S{52+w}")
        else:
            tick_labels.append(f"n S{w}" if w > 0 else "n S1")

    plt.xticks(tick_positions, tick_labels, rotation=45, ha="right", fontsize=9)

    plt.xlabel("Semaine calendaire (n-1 = année précédant le festival, n = année du festival)", fontsize=11)
    plt.ylabel("Nombre cumulé de participants", fontsize=12)
    plt.title("Évolution des ventes - Comparaison des éditions (courbes superposées)", fontsize=14, fontweight="bold")
    plt.legend(loc="upper left", fontsize=10)
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    output_path = SALES_DIR / "evolution_ventes.png"
    plt.savefig(output_path, dpi=150)
    print(f"\nGraphique sauvegardé: {output_path}")
    plt.close()


def main():
    all_data = []
    results = {}

    for year in FILES.keys():
        print(f"Chargement des données {year}...")
        df = load_data(year)
        df_processed = process_year(df, year)

        billets = len(df_processed)
        participants = df_processed["participants"].sum()

        results[year] = {
            "billets": billets,
            "participants": participants,
        }

        all_data.append(df_processed)

    all_data = pd.concat(all_data, ignore_index=True)

    print_summary(results)
    print_detail_by_tarif(all_data)
    create_weekly_chart(all_data, results)


if __name__ == "__main__":
    main()
