import React,{useState} from 'react'
import HeaderInside from '../components/HeaderInside'
import Footer from '../components/Footer'
import SubHeading from '../components/Hackathon/SubHeading'
import FilterHack from '../components/Hackathon/FilterHack'
import BrowseHackathons from '../components/Hackathon/BrowseHackathons'
const Hackathons = () => {
   const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("All Domains");
  const [teamSize, setTeamSize] = useState("Team Size");
  const [college, setCollege] = useState("All Colleges");

  return (
    <div>
    <HeaderInside/>
    <SubHeading/>
    <FilterHack
     search={search}
        setSearch={setSearch}
        domain={domain}
        setDomain={setDomain}
        teamSize={teamSize}
        setTeamSize={setTeamSize}
        college={college}
        setCollege={setCollege}
    />
    <BrowseHackathons
      search={search}
      domain={domain}
      teamSize={teamSize}
      college={college}
    />
    <Footer/>
    </div>
  )
}

export default Hackathons
