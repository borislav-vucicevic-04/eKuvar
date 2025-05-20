import { Link } from 'react-router-dom'
import IRecept from '../../models/recept.interface'
import Style from './KarticaRecepta.module.css'
import { useEffect, useState } from 'react';

import FullHeartIcon from './../../assets/full-heart.svg'
import ChefMidnightBlueOutlineIcon from './../../assets/chef-midnight-blue-outline.svg'

export default function KarticaRecepta({props, delay}: {props: IRecept, delay: number}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  const ocjenaProcenat = `${(props.prosjecna_ocjena / 5) * 100}%`
  const kategorije = [
    props.posno ? 'posno' : 'mrsno',
    props.slatko ? 'slatko' : 'slano',
    props.vegansko ? 'vegansko' : 'nevegansko'
  ];

  const getKateogrija = (kategorija: string) => {
    let className: string = '';
    switch(kategorija) {
      case 'slano': className =  Style.slano; break;
      case 'slatko': className =  Style.slatko; break;
      case 'vegansko': className =  Style.vegansko; break;
      case 'nevegansko': className =  Style.nevegansko; break;
      case 'posno': className =  Style.posno; break;
      case 'mrsno': className =  Style.mrsno; break;
      default: break;
    }
    return className;
  }
  const getProcija = (porcija: number) => {
    let zadnjaCifra = porcija % 10;

    if(zadnjaCifra === 1) return 'osobu';
    else if(zadnjaCifra >= 2 && zadnjaCifra <= 4) return 'osobe'
    else return 'osoba'
  }

  return (
    <Link className={`${Style.kraticaRecepta} ${visible ? Style.isLoaded : ''}`} to={`/recept/${props.id}`}>
      <div className={Style.metaPodaci}>
        {`${props.korisnik}, ${new Date(props.datum_kreiranja).toLocaleDateString()}`}
      </div>
      <h2 className={Style.naslov}>{props.naslov}</h2>
      <div className={Style.ocjena}>
        <div className={Style.zvjezdice} style={{'--rating-percent': ocjenaProcenat}  as React.CSSProperties}>★★★★★</div>
        {`${props.prosjecna_ocjena.toFixed(2)} (${props.broj_ocjena})`}
      </div>
      <div className={Style.brojOmiljenih}>
        <img src={FullHeartIcon} alt='full heart' />
        {props.broj_omiljenih}
        <img src={ChefMidnightBlueOutlineIcon} alt='chef with midnight blue outline' />
        {`za ${props.porcija} ${getProcija(props.porcija)}`}
      </div>
      <div className={Style.kategorijaContainer}>{kategorije.map(item => <span key={item} className={`${Style.kategorija} ${getKateogrija(item)}`}>{item}</span>)}</div>
      <div className={Style.opis}>{props.opis}</div>
    </Link>
  )
}
