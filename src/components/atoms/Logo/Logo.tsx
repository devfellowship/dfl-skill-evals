import Image from "next/image"

export function BrandLogo() {
  return (
    <div className="w-10 h-10 relative">
      <Image
        src="https://tainanfideliscom.s3.sa-east-1.amazonaws.com/personal_tmp/DevFelloShip+1+Si%CC%81mbolo.png"
        alt="DevFellowship Logo"
        width={48}
        height={48}
        priority
      />
    </div>
  )
}