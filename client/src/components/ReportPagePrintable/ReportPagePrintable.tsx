import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import IKorisnik from '../../models/korisnik.interface';
import IIzvjestajKorisnik from '../../models/izvjestajKorisnik.interface';


// Registruj font iz lokalnog fajla
Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: '/fonts/Noto_Sans/NotoSans-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Noto_Sans/NotoSans-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Noto_Sans/NotoSans-Italic.ttf', fontStyle: 'italic' },
  ],
});
// Registracija fonta Playfair Display
Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: '/fonts/Playfair_Display/PlayfairDisplay-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Playfair_Display/PlayfairDisplay-Bold.ttf', fontWeight: 'bold' },
    { src: '/fonts/Playfair_Display/PlayfairDisplay-Italic.ttf', fontStyle: 'italic' },
  ],
});

const colors = {
  bread: '#D8A47F',
  midnightBlue: "#152242",
  black: '#1D1D1D',
  softGray: '#bbbbbb'
}
const style = StyleSheet.create({
  page: {
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 48,
    paddingBottom: 50,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 24
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 8,
    fontFamily: 'Noto Sans',
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  footer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    fontSize: 8,
    fontFamily: 'Noto Sans',
    paddingLeft: 28,
    paddingRight: 28,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontFamily: 'Playfair Display',
    fontSize: 28,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.bread,
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingBottom: 24,
    fontWeight: 600,
    color: colors.midnightBlue
  },
  subtitle: {
    fontFamily: 'Playfair Display',
    fontSize: 22,
    fontWeight: 600,
    color: colors.midnightBlue
  },
  table: {
    fontSize: 12,
    borderColor: colors.black,
    borderWidth: 1.5,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
  },
  rowOdd: {
    backgroundColor: colors.softGray,
    display: 'flex',
    flexDirection: 'row',
  },
  rowEven: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'row',
  },
  cellLeft: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'left',
    padding: 6,
    fontWeight: 600,
    width: '50%',
    textTransform :'upperfirst'
  },
  cellRight: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'right',
    padding: 6,
    width: '50%',
    textTransform: 'upperfirst'
  },
  mojeOcjeneNumber: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'right',
    padding: 4,
    width: '12%',
    textTransform: 'upperfirst'
  },
  mojeOcjeneString: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'left',
    padding: 4,
    width: '38%',
    textTransform: 'upperfirst'
  },
  mojiOmiljeniNumber: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'right',
    padding: 4,
    width: '12%',
    textTransform: 'upperfirst'
  },
  mojiOmiljeniString: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'left',
    padding: 4,
    width: '44%',
    textTransform: 'upperfirst'
  },
  mojiReceptiNumber: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'right',
    padding: 4,
    width: '16%',
    textTransform: 'upperfirst'
  },
  mojiReceptiString: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    textAlign: 'left',
    padding: 4,
    width: '20%',
    textTransform: 'upperfirst'
  }
});


export default function ReportPagePrintable({korisnik, izvjestaj}: {korisnik: IKorisnik, izvjestaj: IIzvjestajKorisnik}) {
  const transformAutor = (text: string) => text.split(' ').map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join(' ');
  return (
    <Document>
      <Page size={'A4'} style={style.page}>
        <View style={style.header} fixed>
          <Text>{new Date().toLocaleDateString()}</Text>
          <Text>eKuvar</Text>
          <Text>{korisnik.puno_ime}</Text>
        </View>
        <View style={style.footer} fixed>
          <Text>{`http://localhost:5173/moj-nalog`}</Text>
          <Text render={({pageNumber, totalPages}) => { return `${pageNumber}/${totalPages}`}} />
        </View>
        <Text style={style.title}>{'Izvještaj o mome nalogu'}</Text>
        <Text style={style.subtitle}>{'Osnovni podaci:'}</Text>
        <View style={style.table}>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Puno ime: </Text></View>
            <View style={style.cellRight}><Text>{korisnik.puno_ime.split(' ').map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join(' ')}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Datum registracije: </Text></View>
            <View style={style.cellRight}><Text>{new Date(korisnik.datum_registracije).toLocaleDateString()}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Poslednja prijava: </Text></View>
            <View style={style.cellRight}><Text>{new Date(korisnik.poslednja_prijava).toLocaleDateString()}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Broj recepta: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.broj_recepta}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Broj ocjena: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.broj_ocjena}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Broj omiljenih: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.broj_omiljenih}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Broj komentara: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.broj_komentara}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Najbolji recept: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.najbolji_recept}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Najomiljeniji recept: </Text></View>
            <View style={style.cellRight}><Text>{izvjestaj.najomiljeniji_recept}</Text></View>
          </View>
        </View>
        
        <Text style={style.subtitle}>{'Moje ocjene:'}</Text>
        <View style={style.table}>
          <View style={style.rowOdd}>
            <View style={style.mojeOcjeneNumber}><Text style={{fontWeight: 600}}>Br. rec:</Text></View>
            <View style={style.mojeOcjeneString}><Text style={{fontWeight: 600}}>Naslov:</Text></View>
            <View style={style.mojeOcjeneString}><Text style={{fontWeight: 600}}>Autor:</Text></View>
            <View style={style.mojeOcjeneNumber}><Text style={{fontWeight: 600}}>Ocjena:</Text></View>
          </View>
          {izvjestaj.moje_ocjene.map((item, index) => {
            return <View style={index % 2 === 0 ? style.rowEven : style.rowOdd}>
              <View style={style.mojeOcjeneNumber}><Text>{item.id}</Text></View>
              <View style={style.mojeOcjeneString}><Text>{item.naslov}</Text></View>
              <View style={style.mojeOcjeneString}><Text>{transformAutor(item.autor)}</Text></View>
              <View style={style.mojeOcjeneNumber}><Text>{item.vrijednost}</Text></View>
            </View>
          })}
        </View>
        
        <Text style={style.subtitle}>{'Moji omiljeni:'}</Text>
        <View style={style.table}>
          <View style={style.rowOdd}>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Br. rec:</Text></View>
            <View style={style.mojiOmiljeniString}><Text style={{fontWeight: 600}}>Naslov:</Text></View>
            <View style={style.mojiOmiljeniString}><Text style={{fontWeight: 600}}>Autor:</Text></View>
          </View>
          {izvjestaj.moji_omiljeni.map((item, index) => {
            return <View style={index % 2 === 0 ? style.rowEven : style.rowOdd}>
              <View style={style.mojiOmiljeniNumber}><Text>{item.id}</Text></View>
              <View style={style.mojiOmiljeniString}><Text>{item.naslov}</Text></View>
              <View style={style.mojiOmiljeniString}><Text>{transformAutor(item.autor)}</Text></View>
            </View>
          })}
        </View>
        
        <Text style={style.subtitle}>{'Moji Recepti:'}</Text>
        <View style={style.table}>
          <View style={style.rowOdd}>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Br. rec:</Text></View>
            <View style={style.mojiOmiljeniString}><Text style={{fontWeight: 600}}>Naslov:</Text></View>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Pros. oc:</Text></View>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Br. oc:</Text></View>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Br. om:</Text></View>
            <View style={style.mojiOmiljeniNumber}><Text style={{fontWeight: 600}}>Br. kom:</Text></View>
          </View>
          {izvjestaj.moji_recepti.map((item, index) => {
            return <View style={index % 2 === 0 ? style.rowEven : style.rowOdd}>
              <View style={style.mojiOmiljeniNumber}><Text>{item.id}</Text></View>
              <View style={style.mojiOmiljeniString}><Text>{item.naslov}</Text></View>
              <View style={style.mojiOmiljeniNumber}><Text>{item.prosjecna_ocjena.toFixed(2)}</Text></View>
              <View style={style.mojiOmiljeniNumber}><Text>{item.broj_ocjena}</Text></View>
              <View style={style.mojiOmiljeniNumber}><Text>{item.broj_omiljenih}</Text></View>
              <View style={style.mojiOmiljeniNumber}><Text>{item.broj_komentara}</Text></View>
            </View>
          })}
        </View>
      </Page>
    </Document>
  )
}
