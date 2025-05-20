import Styles from './SastojciForm.module.css'
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useFormContext } from "react-hook-form";
import TrashCanIcon from './../../assets/trash-can.svg'

interface Sastojak {
  id: number;
  naziv: string;
}

interface DodatiSastojak extends Sastojak {
  kolicina: string;
}

export default function SastojciForm() {
  const [query, setQuery] = useState("");
  const [kolicina, setKolicina] = useState("");
  const [isDodajPending, setIsDodajPending] = useState(false);

  const { control } = useFormContext();
  const queryClient = useQueryClient();

  const { data: sastojci = [] } = useQuery<Sastojak[]>({
    queryKey: ["sastojci", query],
    queryFn: async () => {
      const res = await fetch(`/api/sastojak?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Greška pri dohvaćanju sastojaka");
      return res.json();
    },
    enabled: query.length > 0,
  });

  const dodajSastojakMutation = useMutation({
    mutationFn: async (naziv: string) => {
      const res = await fetch("/api/sastojak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ naziv }),
      });
      if (!res.ok) throw new Error("Greška pri dodavanju sastojka");
      return res.json() as Promise<Sastojak>;
    },
  });

  return (
    <Controller
      name="sastojci"
      control={control}
      rules={{
        validate: (lista) =>
          lista && lista.length > 0 ? true : "Morate unijeti najmanje 1 sastojak",
      }}
      defaultValue={[]}
      render={({ field, fieldState }) => {
        const dodajSastojakUListu = async () => {
          if (!query.trim() || !kolicina.trim()) return;

          if (field.value.find((s: Sastojak) => s.naziv.toLowerCase() === query.toLowerCase())) {
            alert("Sastojak je već dodat!");
            return;
          }

          setIsDodajPending(true);

          const pronadjen = sastojci.find(
            (s) => s.naziv.toLowerCase() === query.toLowerCase()
          );

          let noviSastojak: Sastojak;

          if (pronadjen) {
            noviSastojak = pronadjen;
          } else {
            const potvrda = confirm(`Sastojak "${query}" ne postoji. Dodati u bazu?`);
            if (!potvrda) {
              setIsDodajPending(false);
              return;
            }

            try {
              noviSastojak = await dodajSastojakMutation.mutateAsync(query);
              queryClient.invalidateQueries({ queryKey: ["sastojci"] });
            } catch (err) {
              alert("Greška pri dodavanju sastojka");
              setIsDodajPending(false);
              return;
            }
          }

          const novaLista = [...field.value, { ...noviSastojak, kolicina }];
          field.onChange(novaLista);
          setQuery("");
          setKolicina("");
          setIsDodajPending(false);
        };

        const izbaciSastojakIzListe = (index: number) => {
          if (!confirm("Ukloniti sastojak?")) return;
          const novaLista = [...field.value];
          novaLista.splice(index, 1);
          field.onChange(novaLista);
        };

        return (
          <div className={Styles.sastojciFormWrapper}>
            <span className={Styles.title}>Sastojci:</span>
            <div className={Styles.sastojsciForm}>
              <label className={Styles.labelNaziv} htmlFor='naziv'>Naziv:</label>
              <label className={Styles.labelKolicina} htmlFor='kolicina'>Količina:</label>
              <button type="button" onClick={dodajSastojakUListu}>
                {isDodajPending ? "Dodaje se..." : "Dodaj"}
              </button>
              <input
                id='naziv'
                list="sastojci-lista"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Naziv sastojka"
              />
              <datalist id="sastojci-lista">
                {sastojci.map((s) => (
                  <option key={s.id} value={s.naziv} />
                ))}
              </datalist>
              <input
                id='kolicina'
                value={kolicina}
                onChange={(e) => setKolicina(e.target.value)}
                placeholder="Količina"
              />
            </div>

            {field.value.length > 0 && (
              <table className={Styles.table}>
                <thead>
                  <tr>
                    <th>Naziv</th>
                    <th>Količina</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {field.value.map((s: DodatiSastojak, i: number) => (
                    <tr key={i}>
                      <td>{s.naziv}</td>
                      <td>{s.kolicina}</td>
                      <td>
                        <button type="button" onClick={() => izbaciSastojakIzListe(i)} title='Ukloni sastojak'>
                          <img src={TrashCanIcon} alt="trash" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {fieldState.error && (
              <p className={Styles.error}>{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
