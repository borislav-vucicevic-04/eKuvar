import {Request, Response, Router} from 'express'

const logOutRoute = Router();

const logOut = async (request: Request, response: Response) => {
  try {
    response.cookie('token', 'token', {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
        maxAge: 1
    });
    response.cookie('isAuthorised', 'token', {
        secure: false, 
        sameSite: 'lax',
        maxAge: 1
    });
    response.cookie('korisnik', 'token', {
        secure: false, 
        sameSite: 'lax',
        maxAge: 1
    });
    response.status(200).json({success: true});
    return;
  } catch (error) {
    console.log(error);
    response.status(500).json({error})
    return;
  }
}

logOutRoute.post('/', logOut);

export default logOutRoute