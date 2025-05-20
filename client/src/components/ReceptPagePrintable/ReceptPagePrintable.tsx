import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import IReceptInfo from '../../models/receptInfo.interface';
import { parseDocument } from 'htmlparser2';
import { Element, DataNode, Node } from 'domhandler';


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
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 40,
    paddingBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    rowGap: 24
  },
  naslov: {
    fontFamily: 'Playfair Display',
    fontSize: 28,
    borderBottomStyle: 'solid',
    borderBottomColor: colors.bread,
    borderBottomWidth: 1,
    textAlign: 'center',
    paddingBottom: 16,
    fontWeight: 600,
    color: colors.midnightBlue
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: 16,
    fontSize: 12
  },
  sectionNaslov: {
    fontFamily: 'Playfair Display',
    fontWeight: 600,
    color: colors.midnightBlue,
    fontSize: 24,
    textAlign: 'justify'
  },
  table: {
    borderColor: colors.black,
    borderWidth: 1,
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cellLeft: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    borderColor: colors.black,
    borderStyle: 'solid',
    borderWidth: 1,
    backgroundColor: colors.softGray,
    textAlign: 'left',
    padding: 8,
    fontWeight: 600,
    width: '50%',
  },
  cellRight: {
    flexGrow: 1,
    alignSelf: 'stretch',
    fontFamily: 'Noto Sans',
    color: colors.black,
    borderColor: colors.black,
    borderStyle: 'solid',
    borderWidth: 1,
    textAlign: 'right',
    padding: 8,
    width: '50%',
  },
  li: {
    fontFamily: 'Noto Sans',
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 16,
    color: colors.black,
    textAlign: 'justify'
  },
  paragraph: {
    textAlign: 'justify',
    fontFamily: 'Noto Sans',
    fontSize: 12,
    color: colors.black,
    lineHeight: 1.5,
  },
  sectionContentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
  underline: { textDecoration: 'underline' },
  heading3: { 
    fontSize: 18, 
    fontFamily: 'Playfair Display',
    fontWeight: 600,
    color: colors.midnightBlue,
    textAlign: 'justify'
  },
  header: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    fontSize: 8,
    fontFamily: 'Noto Sans',
    paddingLeft: 64,
    paddingRight: 64,
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
    paddingLeft: 64,
    paddingRight: 64,
    paddingBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default function ReceptPagePrintable({recept, sastojci, omiljen, ocjena}: IReceptInfo) {  
  return (
    <Document>
      <Page size={'A4'} style={style.page}>
        <View style={style.header} fixed>
          <Text>{new Date().toLocaleDateString()}</Text>
          <Text>eKuvar</Text>
          <Text>{recept.naslov}</Text>
        </View>
        <View style={style.footer} fixed>
          <Text>{`http://localhost:5173/recept/${recept.id}`}</Text>
          <Text render={({pageNumber, totalPages}) => { return `${pageNumber}/${totalPages}`}} />
        </View>
        <Text style={style.naslov}>{`${recept.naslov[0].toUpperCase()}${recept.naslov.slice(1)}`}</Text>
        <View style={style.section}>
          <Text style={style.sectionNaslov}>Podaci o receptu:</Text>
          <View style={style.table}>
            <View style={style.row}>
              <View style={style.cellLeft}><Text>Datum objave:</Text></View>
              <View style={style.cellRight}><Text>{new Date(recept.datum_kreiranja).toLocaleDateString()}</Text></View>
            </View>
            <View style={style.row}>
              <View style={style.cellLeft}><Text>Prosječna ocjena:</Text></View>
              <View style={style.cellRight}><Text>{recept.prosjecna_ocjena} ({recept.broj_ocjena})</Text></View>
            </View>
            <View style={style.row}>
              <View style={style.cellLeft}><Text>Broj omiljenih:</Text></View>
              <View style={style.cellRight}><Text>{recept.broj_omiljenih}</Text></View>
            </View>
            <View style={style.row}>
              <View style={style.cellLeft}><Text>Moja ocjena:</Text></View>
              <View style={style.cellRight}><Text>{!Number(ocjena) ? 'neocjenjen' : Number(ocjena)}</Text></View>
            </View>
            <View style={style.row}>
              <View style={style.cellLeft}><Text>Kategorije:</Text></View>
              <View style={style.cellRight}><Text>{getCategories(recept.posno, recept.slatko, recept.vegansko, omiljen, recept.mojRecept)}</Text></View>
            </View>
          </View>
        </View>
        <View style={style.section}>
          <Text style={style.sectionNaslov}>{`Sastojci za ${recept.porcija} ${getPorcionWord(recept.porcija)}`}</Text>
          <View>{sastojci.map(item => <Text key={item.id_sastojak} style={style.li}>{`• ${item.naziv}, ${item.kolicina}`}</Text>)}</View>
        </View>
        <View style={style.section}>
          <Text style={style.sectionNaslov}>Kratak opis:</Text>
          <Text style={style.paragraph}>{recept.opis}</Text>
        </View>
        <View style={style.section}>
          <Text style={style.sectionNaslov}>Priprema:</Text>
          <View style={style.sectionContentWrapper}>{htmlToPdfElements(recept.priprema)}</View>
        </View>
      </Page>
    </Document>
  )
}

const getCategories = (posno: boolean, slatko: boolean, vegansko: boolean, omiljen: boolean, mojRecept: boolean) => {
  const categories: string[] = []

  categories.push(posno ? 'posno' : 'mrsno');
  categories.push(slatko ? 'slatko' : 'slano');
  categories.push(vegansko ? 'vegansko' : 'nevegansko');

  if(omiljen) categories.push('omiljen');
  if(mojRecept) categories.push('moj recept');

  return categories.join(', ')
}

// Funkcija za dobijanje pravilno napisane riječi
const getPorcionWord = (porcija: number) => {
  let ostatak = porcija % 10;
  if(porcija >= 11 && porcija <= 20) return 'osoba'
  else if(ostatak === 1) return 'osobu';
  else if(ostatak >= 2 && ostatak <= 4) return 'osobe'
  else return 'osoba'
}

const renderNode = (node: Node, index: number): React.ReactNode => {
  if (node.type === 'text') {
    const text = (node as DataNode).data.trim();
    return text ? <Text key={index}>{text}</Text> : null;
  }

  if (node.type === 'tag') {
    const el = node as Element;
    const children = el.children
      .map((child, i) => renderNode(child, i))
      .filter(Boolean);

    switch (el.tagName) {
      case 'p':
      case 'div':
        return (
          <View key={index} style={style.paragraph}>
            {children}
          </View>
        );
      case 'strong':
      case 'b':
        return (
          <Text key={index} style={style.bold}>
            {children}
          </Text>
        );
      case 'em':
      case 'i':
        return (
          <Text key={index} style={style.italic}>
            {children}
          </Text>
        );
      case 'u':
        return (
          <Text key={index} style={style.underline}>
            {children}
          </Text>
        );
      case 'h3':
        return (
          <Text key={index} style={style.heading3}>
            {children}
          </Text>
        );
      case 'ul':
        return <View key={index}>{children}</View>;
      case 'ol':
        return <View key={index}>{children}</View>;
      case 'li':
        return (
          <Text key={index} style={style.li}>
            • {children}
          </Text>
        );
      default:
        return (
          <Text key={index}>
            {children}
          </Text>
        );
    }
  }

  return null;
};

const htmlToPdfElements = (html: string): React.ReactNode[] => {
  const doc = parseDocument(html);
  return doc.children.map((node, i) => renderNode(node, i)).filter(Boolean) as React.ReactNode[];
};