from fastapi import APIRouter,UploadFile,File,HTTPException
from pypdf import PdfReader
router=APIRouter(prefix='/api/documents',tags=['documents'])
@router.post('/extract')
async def extract(file:UploadFile=File(...)):
 data=await file.read()
 if file.filename and file.filename.lower().endswith('.pdf'):
  import io
  text='\n'.join((p.extract_text() or '') for p in PdfReader(io.BytesIO(data)).pages)
  return {'filename':file.filename,'text':text[:200000]}
 if file.content_type and file.content_type.startswith('text/'):
  return {'filename':file.filename,'text':data.decode('utf-8','replace')[:200000]}
 raise HTTPException(415,'MVP supports PDF and text uploads')
