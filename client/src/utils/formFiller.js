export default profile => {
  const out = {}
  // required fields
  out.status = profile.status
  out.skills = profile.skills.join(', ')
  // optional fields
  if (profile.social) {
    Object.entries(profile.social).forEach(item => (out[item[0]] = item[1]))
  }
  out.company = profile.company ? profile.company : ''
  out.website = profile.website ? profile.website : ''
  out.location = profile.location ? profile.location : ''
  out.bio = profile.bio ? profile.bio : ''
  out.githubusername = profile.githubusername ? profile.githubusername : ''

  return out
}
