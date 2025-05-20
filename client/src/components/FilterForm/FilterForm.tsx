import { useForm } from 'react-hook-form'
import Style from './FilterForm.module.css'
import IFilter from '../../models/filter.interface';
import { FormEvent } from 'react';

interface Props {
  currentFilter: IFilter,
  setVisible: (visible: boolean) => void,
  setFilter: (filter: IFilter) => void
}



export default function FilterForm({currentFilter, setVisible, setFilter}: Props) {
  const form = useForm<IFilter>({
    defaultValues: {
      naslov: currentFilter.naslov,
      korisnik: currentFilter.korisnik,
      datum_kreiranja_min: currentFilter.datum_kreiranja_min?.split('T')[0],
      datum_kreiranja_max: currentFilter.datum_kreiranja_max?.split('T')[0],
      porcija_min: currentFilter.porcija_min,
      porcija_max: currentFilter.porcija_max,
      prosjecna_ocjena_min: currentFilter.prosjecna_ocjena_min,
      prosjecna_ocjena_max: currentFilter.prosjecna_ocjena_max,
      vegansko: currentFilter.vegansko,
      slatko: currentFilter.slatko,
      posno: currentFilter.posno,
      sortirajPo: currentFilter.sortirajPo,
      poredak: currentFilter.poredak
    }
  });
  console.log(currentFilter, form.formState.defaultValues);
  
  const { register, handleSubmit, formState, reset } = form;
  const onSubmit = (data: IFilter) => {
    console.log(!!data.vegansko);
    
    
    setFilter({
      naslov: !!data.naslov ? data.naslov : null,
      korisnik: !!data.korisnik ? data.korisnik : null,
      datum_kreiranja_min: !!data.datum_kreiranja_min ? new Date(data.datum_kreiranja_min).toISOString() : null,
      datum_kreiranja_max: !!data.datum_kreiranja_max ? new Date(data.datum_kreiranja_max).toISOString() : null,
      porcija_min: !!data.porcija_min ? Number(data.porcija_min) : null,
      porcija_max: !!data.porcija_max ? Number(data.porcija_max) : null,
      prosjecna_ocjena_min: !!data.prosjecna_ocjena_min ? Number(data.prosjecna_ocjena_min) : null,
      prosjecna_ocjena_max: !!data.prosjecna_ocjena_max ? Number(data.prosjecna_ocjena_max) : null,
      vegansko: !!data.vegansko ? data.vegansko : null,
      posno: !!data.posno ? data.posno : null,
      slatko: !!data.slatko ? data.slatko : null,
      sortirajPo: data.sortirajPo,
      poredak: data.poredak
    });
    setVisible(false)
  }
  const onReset = (event: FormEvent) => {
    event.preventDefault();
    reset({
      naslov: null,
      korisnik: null,
      datum_kreiranja_min: null,
      datum_kreiranja_max: null,
      porcija_min: null,
      porcija_max: null,
      prosjecna_ocjena_min: null,
      prosjecna_ocjena_max: null,
      vegansko: null,
      posno: null,
      slatko: null,
      sortirajPo: 'prosjecna_ocjena',
      poredak: 'desc'
    })
  }
  return (
    <div className={Style.formOverlay}>
      <form className={Style.formBody} onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <h2 className={Style.formTitle}>filtriraj i sortiraj</h2>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Naslov:</span>
          <input type="text" className={Style.formControlInput} id='naslov' {...register('naslov')} />
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Autor:</span>
          <input type="text" className={Style.formControlInput} id='korisnik' {...register('korisnik')} />
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Datum kreiranja (od - do):</span>
          <input type="date" className={Style.formControlInput} id='datum_kreiranja_min' {...register('datum_kreiranja_min')} />
          <input type="date" className={Style.formControlInput} id='datum_kreiranja_max' {...register('datum_kreiranja_max')} />
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Porcija (od - do):</span>
          <input type='number' className={Style.formControlInput} id='porcija_min' {...register('porcija_min')} />
          <input type='number' className={Style.formControlInput} id='porcija_max' {...register('porcija_max')} />
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Prosjecna ocjena (od - do):</span>
          <input type='number' step={0.01} className={Style.formControlInput} id='prosjecna_ocjena_min' {...register('prosjecna_ocjena_min', {
            min: {
              value: 1,
              message: 'Najmanji broj može biti 1'
            },
            max: {
              value: 5,
              message: 'Najveći broj može biti 5'
            },
          })} />
          <input type='number' step={0.01} className={Style.formControlInput} id='prosjecna_ocjena_max' {...register('prosjecna_ocjena_max', {
            min: {
              value: 1,
              message: 'Najmanji broj može biti 1'
            },
            max: {
              value: 5,
              message: 'Najveći broj može biti 5'
            },
          })} />
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Kategorije:</span>
          <select className={Style.formControlInput} id='posno' {...register('posno')}>
            <option value={''}>{`Posno ili mrsno`}</option>
            <option value={'1'}>{`Posno`}</option>
            <option value={'0'}>{`Mrsno`}</option>
          </select>
          <select className={Style.formControlInput} id='slatko' {...register('slatko')}>
            <option value={''}>{`Slatko ili slano`}</option>
            <option value={'1'}>{`Slatko`}</option>
            <option value={'0'}>{`Slano`}</option>
          </select>
          <select className={Style.formControlInput} id='vegansko' {...register('vegansko')}>
            <option value={''}>{`Vegansko ili nevegansko`}</option>
            <option value={'1'}>{`Vegansko`}</option>
            <option value={'0'}>{`Nevegansko`}</option>
          </select>
        </label>
        <label className={Style.formControl}>
          <span className={Style.formControlText}>Sortiraj po:</span>
          <select className={Style.formControlInput} {...register('sortirajPo')}>
            <option value={'naslov'}>Naslov</option>
            <option value={'korisnik'}>Autor</option>
            <option value={'datum_kreiranja'}>Datum kreiranja</option>
            <option value={'porcija'}>Porcija</option>
            <option value={'prosjecna_ocjena'}>Prosjecna ocjena</option>
          </select>
          <select className={Style.formControlInput} {...register('poredak')}> 
            <option value={'asc'}>Rastući poredak</option>
            <option value={'desc'}>Opadajući poredak</option>
          </select>
        </label>
        <div className={Style.formControl}>
          <button type='button' id='closeForm' className={Style.closeFormBtn} onClick={() => {setVisible(false)}}>Odustani</button>
          <button type='reset' className={Style.formControlBtn}>Očisti filter</button>
          <button type='submit' className={Style.formControlBtn}>filtriraj</button>
        </div>
      </form>
    </div>
  )
}
