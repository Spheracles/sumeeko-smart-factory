from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import math
out=Path(__file__).parent/'site'/'icons';out.mkdir(parents=True,exist_ok=True)

def logo(size,maskable=False):
 S=size*3; im=Image.new('RGB',(S,S),(16,29,43));d=ImageDraw.Draw(im)
 # radial concentric industrial texture
 for r in range(int(S*.71),int(S*.12),-6):
  a=1-r/(S*.72);c=(int(16+12*a),int(29+30*a),int(43+46*a));d.ellipse((S//2-r,S//2-r,S//2+r,S//2+r),fill=c)
 cx,cy=S*.5,S*.5
 fac=.62 if maskable else .78
 r=S*.42*fac
 def hexpts(rad, shift=0):return [(cx+rad*math.cos(math.pi/6+math.pi*2*i/6+shift),cy+rad*math.sin(math.pi/6+math.pi*2*i/6+shift)) for i in range(6)]
 lw=int(S*.022)
 d.line(hexpts(r)+[hexpts(r)[0]],fill=(245,158,56),width=lw,joint='curve')
 d.line(hexpts(r*.84)+[hexpts(r*.84)[0]],fill=(48,85,112),width=max(2,lw//3),joint='curve')
 # fine machined gear ring
 R=r*.62
 for i in range(16):
  a=i*2*math.pi/16
  d.line([(cx+R*.86*math.cos(a),cy+R*.86*math.sin(a)),(cx+R*1.07*math.cos(a),cy+R*1.07*math.sin(a))],fill=(54,197,232),width=int(S*.018))
 d.ellipse((cx-R*.88,cy-R*.88,cx+R*.88,cy+R*.88),outline=(54,197,232),width=int(S*.020))
 d.ellipse((cx-R*.46,cy-R*.46,cx+R*.46,cy+R*.46),outline=(180,206,226),width=int(S*.020))
 d.ellipse((cx-R*.23,cy-R*.23,cx+R*.23,cy+R*.23),fill=(241,245,248))
 # four little rivets
 for a in (math.pi/4,3*math.pi/4,5*math.pi/4,7*math.pi/4):
  x=cx+(r*.73)*math.cos(a);y=cy+(r*.73)*math.sin(a);rr=S*.014
  d.ellipse((x-rr,y-rr,x+rr,y+rr),fill=(255,187,99))
 return im.resize((size,size),Image.Resampling.LANCZOS)
for s in (192,512):logo(s).save(out/f'icon-{s}.png', optimize=True)
logo(512,True).save(out/'maskable-512.png',optimize=True)
logo(180).save(out/'apple-touch-icon.png',optimize=True)
logo(64).save(out/'favicon.png',optimize=True)
