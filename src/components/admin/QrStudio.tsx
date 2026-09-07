"use client";

import { useMemo, useState } from "react";
import QRCode from "qrcode";

type Card = {
  label: string;
  url: string;
  dataUrl: string;
};

export function QrStudio({
  baseUrl,
  restaurantName,
}: {
  baseUrl: string;
  restaurantName: string;
}) {
  const [tableCount, setTableCount] = useState(8);
  const [cards, setCards] = useState<Card[]>([]);
  const [busy, setBusy] = useState(false);
  const menuUrl = useMemo(() => baseUrl.replace(/\/$/, ""), [baseUrl]);

  async function generate() {
    setBusy(true);
    const next: Card[] = [
      {
        label: "Genel menü",
        url: menuUrl,
        dataUrl: await QRCode.toDataURL(menuUrl, {
          width: 480,
          margin: 1,
          color: { dark: "#111111", light: "#ffffff" },
        }),
      },
    ];

    for (let i = 1; i <= tableCount; i += 1) {
      const url = `${menuUrl}/?masa=${i}`;
      next.push({
        label: `Masa ${i}`,
        url,
        dataUrl: await QRCode.toDataURL(url, {
          width: 480,
          margin: 1,
          color: { dark: "#111111", light: "#ffffff" },
        }),
      });
    }

    setCards(next);
    setBusy(false);
  }

  function download(card: Card) {
    const link = document.createElement("a");
    link.href = card.dataUrl;
    link.download = `${restaurantName}-${card.label}.png`.replace(/\s+/g, "-");
    link.click();
  }

  return (
    <div>
      <div className="no-print flex flex-wrap items-end gap-4 rounded-3xl border border-line bg-paper p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm text-muted">Masa sayısı</span>
          <input
            type="number"
            min={0}
            max={80}
            value={tableCount}
            onChange={(event) => setTableCount(Number(event.target.value))}
            className="w-32 rounded-2xl border border-line bg-cream/30 px-4 py-3 outline-none focus:border-olive"
          />
        </label>
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="rounded-2xl bg-olive px-5 py-3 font-medium text-paper hover:bg-olive-dark disabled:opacity-60"
        >
          {busy ? "Hazırlanıyor…" : "QR kodları oluştur"}
        </button>
        {cards.length > 0 ? (
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-2xl border border-line px-5 py-3 text-ink hover:bg-cream"
          >
            Yazdır
          </button>
        ) : null}
      </div>

      {cards.length === 0 ? (
        <p className="mt-8 text-muted">
          Masalara yapıştırmak için QR kodlarını oluşturun. Genel menü kodu masa
          numarası göstermez; masa kodları menüde “Masa 3” gibi bir etiket açar.
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.url}
              className="rounded-3xl border border-line bg-paper p-5 text-center"
            >
              <p className="font-serif text-2xl">{restaurantName}</p>
              <p className="mt-1 text-sm tracking-[0.18em] text-brass uppercase">
                {card.label}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.dataUrl}
                alt={card.label}
                className="mx-auto mt-4 h-44 w-44"
              />
              <p className="mt-2 text-xs break-all text-muted">{card.url}</p>
              <button
                type="button"
                onClick={() => download(card)}
                className="no-print mt-3 text-sm text-olive hover:underline"
              >
                PNG indir
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
