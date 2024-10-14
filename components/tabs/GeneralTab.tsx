import ProfileUpdate from "../ProfileUpdate";
import SkillsUpdate from "../SkillsUpdate";
import SocialsUpdate from "../SocialsUpdate";

export default function GeneralTab({userData}: {userData: any}) {
  return (
    <div className="max-sm:mt-5">
      <ProfileUpdate userData={userData} />
      <SkillsUpdate skills={userData.skills} />
      <SocialsUpdate socials={userData.socials} />
    </div>
  );
}
