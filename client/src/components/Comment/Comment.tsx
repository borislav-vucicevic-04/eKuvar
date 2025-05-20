import Style from './Comment.module.css'
import ICommentProps from '../../models/commentProps.interface'

import ReplyIcon from './../../assets/reply-arrow.svg'
import CommentsIcon from './../../assets/comments.svg'
import TrashCanIcon from  './../../assets/red-trash-can.svg'
import { useState } from 'react'
import IReceptInfo from '../../models/receptInfo.interface'
import { useKorisnik } from '../../contexts/KorisnikContext'
import { useNavigate } from 'react-router-dom'

const deleteComment = async (id_komentar: number) => {
  let response = await fetch('/api/komentar/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({id_komentar})
  });

  if(!response.ok) throw response.status;
  return await response.json()
}
// Funkcija za postovanje komentara
const postComment = async (id_recept: number, odgovor_na: number | null, datum_objave: string, commentContent: string) => {
  let result = await fetch('/api/komentar/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({id_recept, odgovor_na, datum_objave, sadrzaj: commentContent})
  })
  if(!result.ok) throw result.status;
  return result.json();
}

export default function Comment(props: ICommentProps) {
  const navigate = useNavigate();
  const {korisnik} = useKorisnik();  
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('');
  const [commentPending, setCommentPending] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const myReplies = props.sviKomentari.filter(item => item.odgovor_na === props.id);
  const datumObjave = new Date(props.datum_objave);
  const dateTime = `${datumObjave.toLocaleDateString()} ${datumObjave.toLocaleTimeString()}`;

  const handleDeleteComment = async () => {
    if(!confirm('Da li ste sigurni da želite obrisati komentar?\n\n OVA RADNJA JE NEPOVRATNA!')) return
    try {
      await deleteComment(props.id);
      const newDetaljiRecepta = {...props.detaljiRecepta} as IReceptInfo;
      newDetaljiRecepta.komentari = props.sviKomentari.filter(item => item.id !== props.id)
      props.setDetaljiRecepta(newDetaljiRecepta)
    } 
    catch (error) {
      if (error === 401){
        navigate('/unauthorised', {replace: true})
      }
      else {
        alert("Došlo je do interne greške na serveru")
      }
    }
  }

  const handleTextAreaChange = (e: React.ChangeEvent) => {
    let value = (e.target as HTMLTextAreaElement).value.slice(0, 255)
    setCommentContent(value)
  }
    const handlePostComment = async () => {
      if(commentContent.length === 0) return;
      
      try {
        setCommentPending(true);
        
        const newDetaljiRecepta = {...props.detaljiRecepta} as IReceptInfo;
        const id_recept = newDetaljiRecepta.recept.id;
        const odgovor_na = props.id;
        const datum_objave = new Date().toISOString();
        const insertedID = (await postComment(id_recept, odgovor_na, datum_objave, commentContent)).insertedID;
        console.log(insertedID);
        
        if(!insertedID) {
          setCommentPending(false)
          alert('Doslo je do interne greske na serveru!');
          return;
        }
        newDetaljiRecepta.komentari.unshift({
          id: insertedID,
          id_recept,
          autor: korisnik!.puno_ime,
          odgovor_na,
          datum_objave,
          mojKomentar: true,
          sadrzaj: commentContent
        });
        props.setDetaljiRecepta(newDetaljiRecepta);
      } catch (error) {
          if (error === 401){
            navigate('/unauthorised', {replace: true})
          }
          else {
            alert("Došlo je do interne greške na serveru")
          }
      } finally {
        setCommentPending(false);
        setCommentContent('');
        setIsReplying(false);
        setShowReplies(true);
      }
    }

  return (
    <div className={Style.commentWrapper}>
      <div className={Style.commentHeader}>{`${props.korisnik}, ${dateTime}`}</div>
      <div className={Style.commentBody}>{props.sadrzaj}</div>
      <div className={Style.commentFooter}>
        <button className={Style.replyBtn} onClick={() => {
          setIsReplying(true);
        }}>
          <img src={ReplyIcon} alt="reply arrow" />
          Odgovori
        </button>
        {myReplies.length >= 1 ? <button className={Style.showRepliesBtn} onClick={() => {setShowReplies(!showReplies)}}>
          <img src={CommentsIcon} alt="message buble" />
          { !showReplies ? 
            `Prikaži odgovore (${myReplies.length})` :
            `Sakrij odgovore`
          }
        </button> : <></>}
        {props.mojKomentar ? <button onClick={handleDeleteComment} className={Style.deleteCommentBtn}>
          <img src={TrashCanIcon} alt="trash can" />
          Obriši komentar
        </button> : <></>}
      </div>
      <form id={props.id.toString()} className={Style.commentForm} style={{'display': isReplying ? 'block' : 'none'}}>
        <div className={Style.textareaWrapper}>
          <textarea onChange={handleTextAreaChange} value={commentContent}></textarea>
          <span>{`${commentContent.length} / 255`}</span>
        </div>
        <button type='button' onClick={handlePostComment} className={Style.submit} disabled={commentPending}>{commentPending ? 'slanje zahtjeva...' : 'sačuvaj odgovor'}</button>
        <button type='button' className={Style.delete} disabled={commentPending} onClick={() => {
          if(commentContent.length > 0 && !confirm("Da li ste sigurni da želite odustati? Promjene neće biti sačuvane!")) return;
          setCommentContent('')
          setIsReplying(false)}
        }>{`Odustani`}</button>
      </form>
      <div style={{display: showReplies ? 'block' : 'none'}} className={Style.commentRepliesWrapper}>
        {
          myReplies.map(item => <Comment key={item.id} id={item.id} korisnik={item.autor} odgovorNa={item.odgovor_na} sviKomentari={props.sviKomentari} datum_objave={item.datum_objave} sadrzaj={item.sadrzaj} mojKomentar={item.mojKomentar} detaljiRecepta={props.detaljiRecepta}  setDetaljiRecepta={props.setDetaljiRecepta}/>)
        }
      </div>
    </div>
  )
}
