import React from 'react'

const DevelopersTalk = ({ comments }) => {
  // build list of unique developers
  const developers = []
  comments.forEach(comment => {
    const { owner, ownerName } = comment
    // check if user exists
    if (owner !== null) {
      // they do -> proceed
      if (developers.length === 0) {
        developers.push({
          id: owner._id,
          name: ownerName,
          avatar: owner.avatar,
          useImage: owner.useImage,
          image: owner.image
        })
      } else if (
        developers.findIndex(dev => {
          return dev.id === owner._id
        }) === -1
      ) {
        developers.push({
          id: owner._id,
          name: ownerName,
          avatar: owner.avatar,
          useImage: owner.useImage,
          image: owner.image
        })
      }
    }
  })
  // extract first five developers
  const firstInList = (list, stop) => {
    if (list.length < stop) {
      return list
    } else {
      const first = []
      for (let i = 0; i < stop; i++) {
        first.push(list[i])
      }
      return first
    }
  }
  const firstFiveInList = firstInList(developers, 5)
  // count other developers
  const restDev = developers.length - firstFiveInList.length

  return (
    <div className='dev_container'>
      {firstFiveInList.map(dev => {
        return (
          <div key={dev.id} className='img_container--smallest mxr-xs'>
            <img src={dev.useImage ? dev.image : dev.avatar} title={dev.name} />
          </div>
        )
      })}
      {restDev > 0 && (
        <h4 className='comment__head_text mxr-xs'>
          ...and {restDev} other{restDev > 1 && 's'}
        </h4>
      )}
    </div>
  )
}

export default DevelopersTalk
