import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import IIzvjestajRecept from '../../models/izvjestajRecept.interface';


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
});

export default function ReceptReportPrintable({izvjestaj}: {izvjestaj: IIzvjestajRecept}) {
  const {osnovni_podaci, ocjene, omiljeni} = izvjestaj;
  const generateCategories = (posno: boolean, slatko: boolean, vegansko: boolean) => {
    return [
      posno ? 'posno' : 'mrsno',
      slatko ? 'slatko' : 'slano',
      vegansko ? 'vegansko' : 'nevegansko'
    ].join(', ');
  }
  const transformKorisnik = (text: string) => text.split(' ').map(item => `${item[0].toUpperCase()}${item.slice(1)}`).join(' ');
  return (
    <Document>
      <Page size={'A4'} style={style.page}>
        <View style={style.header} fixed>
          <Text>{new Date().toLocaleDateString()}</Text>
          <Text>eKuvar</Text>
          <Text>{osnovni_podaci.naslov}</Text>
        </View>
        <View style={style.footer} fixed>
          <Text>{`http://localhost:5173/moj-nalog`}</Text>
          <Text render={({pageNumber, totalPages}) => { return `${pageNumber}/${totalPages}`}} />
        </View>
        <Text style={style.title}>{'Izvještaj o receptu'}</Text>

        <Text style={style.subtitle}>{'Osnovni podaci:'}</Text>
        <View style={style.table}>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Broj recepta:</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.id}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Naslov</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.naslov}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Autor:</Text></View>
            <View style={style.cellRight}><Text>{transformKorisnik(osnovni_podaci.autor)}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Datum kreiranja</Text></View>
            <View style={style.cellRight}><Text>{new Date(osnovni_podaci.datum_kreiranja).toLocaleDateString()}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Porcija</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.porcija}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Prosječna ocjena:</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.prosjecna_ocjena}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Broj ocjena:</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.broj_ocjena}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Broj omiljenih</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.broj_omiljenih}</Text></View>
          </View>
          <View style={style.rowEven}>
            <View style={style.cellLeft}><Text>Broj komentara:</Text></View>
            <View style={style.cellRight}><Text>{osnovni_podaci.broj_komentara}</Text></View>
          </View>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Kategorije:</Text></View>
            <View style={style.cellRight}><Text>{generateCategories(osnovni_podaci.posno, osnovni_podaci.slatko, osnovni_podaci.vegansko)}</Text></View>
          </View>
        </View>
        
        <Text style={style.subtitle}>{'Ocjene:'}</Text>
        <View style={style.table}>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Korisnik: </Text></View>
            <View style={style.cellLeft}><Text>Ocjena: </Text></View>
          </View>
          {ocjene.map((item, index) => <View style={index % 2 === 0 ? style.rowEven : style.rowOdd}>
            <View style={style.cellLeft}><Text>{transformKorisnik(item.korisnik)}</Text></View>
            <View style={style.cellLeft}><Text>{item.vrijednost}</Text></View>
          </View>)}
        </View>

        <Text style={style.subtitle}>{'Omiljeni:'}</Text>
        <View style={style.table}>
          <View style={style.rowOdd}>
            <View style={style.cellLeft}><Text>Korisnik: </Text></View>
          </View>
          {omiljeni.map((item, index) => <View style={index % 2 === 0 ? style.rowEven : style.rowOdd}>
            <View style={style.cellLeft}><Text>{transformKorisnik(item.korisnik)}</Text></View>
          </View>)}
        </View>
      </Page>
    </Document>
  )
}
