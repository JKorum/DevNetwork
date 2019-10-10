//in-> obj with possible undefined props values
//out-> obj with truthy props values
//params -> objs
const getRidOfUndefined = (out, items) => {
  Object.entries(items).forEach(item => {
    if (item[1] !== undefined) {
      out[item[0]] = item[1]
    }
  })
}

//in-> req.body
//out-> profile to save in db
//param -> obj
module.exports = input => {
  let {
    userId,
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername,
    youtube,
    twitter,
    facebook,
    linkedin,
    instargam
  } = input

  //start build profile
  let profile = {}
  getRidOfUndefined(profile, {
    company,
    website,
    location,
    status,
    skills,
    bio,
    githubusername
  })

  //construct social obj
  let social = {}
  getRidOfUndefined(social, { youtube, twitter, facebook, linkedin, instargam })

  //end build profile
  if (Object.entries(social).length !== 0) {
    profile = { user: userId, ...profile, social }
  } else {
    profile = { user: userId, ...profile }
  }
  if (profile.skills) {
    profile.skills = profile.skills.split(',').map(item => item.trim())
  }

  return profile
}
