export const mockUser = {
  id: 'jravas',
  display_name: 'jravas',
  images: [{ url: 'https://i.scdn.co/image/ab6775700000ee85b5d374d281b9e510eba11378' }],
}

export const mockNowPlaying = {
  is_playing: true,
  progress_ms: 87000,
  item: {
    name: 'You Get What You Give',
    duration_ms: 225000,
    artists: [{ name: 'New Radicals' }],
    album: {
      images: [
        { url: 'https://i.scdn.co/image/ab67616d0000b2737b3516da0b1d9d41bfd2e7c8' },
        { url: 'https://i.scdn.co/image/ab67616d00001e027b3516da0b1d9d41bfd2e7c8' },
        { url: 'https://i.scdn.co/image/ab67616d00004851b5d374d281b9e510eba11378' },
      ],
    },
  },
}

const makeArtist = (id, name, genres, popularity, imageUrl) => ({
  id,
  name,
  genres,
  popularity,
  images: [
    { url: imageUrl },
    { url: imageUrl },
    { url: imageUrl },
  ],
})

export const mockArtists = {
  items: [
    makeArtist('1', 'Radiohead', ['art rock', 'alternative rock', 'melancholia'], 79, 'https://i.scdn.co/image/ab6761610000e5eb4d2f80038a4b4e2d30147778'),
    makeArtist('2', 'Arcade Fire', ['art rock', 'indie rock', 'chamber pop'], 72, 'https://i.scdn.co/image/ab6761610000e5eb6ac5c2e56ad88d87f4ee7ecc'),
    makeArtist('3', 'LCD Soundsystem', ['dance-punk', 'indie rock', 'new wave'], 68, 'https://i.scdn.co/image/ab6761610000e5eba3fc4c9b53bd3b92d1248e55'),
    makeArtist('4', 'Bon Iver', ['folk', 'indie folk', 'chamber pop'], 75, 'https://i.scdn.co/image/ab6761610000e5eb3f7c3de9b44c0e3e3f47bbf4'),
    makeArtist('5', 'The National', ['indie rock', 'chamber pop', 'art rock'], 70, 'https://i.scdn.co/image/ab6761610000e5eb2a2e39e09f6b5abf9dca1ee7'),
    makeArtist('6', 'Sufjan Stevens', ['indie folk', 'chamber pop', 'folk'], 71, 'https://i.scdn.co/image/ab6761610000e5eb3c1d5ff0c2b8b3e1e4b0b7d8'),
    makeArtist('7', 'Tame Impala', ['psychedelic pop', 'neo-psychedelia', 'indie rock'], 84, 'https://i.scdn.co/image/ab6761610000e5eb0c6a58e8d2a01c2e42ac3df3'),
    makeArtist('8', 'Beach House', ['dream pop', 'indie pop', 'shoegaze'], 66, 'https://i.scdn.co/image/ab6761610000e5eb1f4e1d4f0c4a6c2e4d8a7b22'),
    makeArtist('9', 'Portishead', ['trip hop', 'alternative rock', 'melancholia'], 67, 'https://i.scdn.co/image/ab6761610000e5eb7f5c5e5c5c5c5c5c5c5c5c5c'),
    makeArtist('10', 'Nick Cave', ['art rock', 'post-punk', 'gothic rock'], 65, 'https://i.scdn.co/image/ab6761610000e5eb5e5e5e5e5e5e5e5e5e5e5e5e'),
    makeArtist('11', 'PJ Harvey', ['art rock', 'post-punk', 'alternative rock'], 62, 'https://i.scdn.co/image/ab6761610000e5eb6f6f6f6f6f6f6f6f6f6f6f6f'),
    makeArtist('12', 'Björk', ['art pop', 'experimental', 'electronic'], 74, 'https://i.scdn.co/image/ab6761610000e5eb7f7f7f7f7f7f7f7f7f7f7f7f'),
    makeArtist('13', 'Four Tet', ['electronica', 'ambient', 'idm'], 63, 'https://i.scdn.co/image/ab6761610000e5eb8f8f8f8f8f8f8f8f8f8f8f8f'),
    makeArtist('14', 'Aphex Twin', ['idm', 'ambient', 'electronica'], 69, 'https://i.scdn.co/image/ab6761610000e5eb9f9f9f9f9f9f9f9f9f9f9f9f'),
    makeArtist('15', 'Massive Attack', ['trip hop', 'electronic', 'alternative rock'], 71, 'https://i.scdn.co/image/ab6761610000e5ebafafafafafafafafafafafafaf'),
  ],
}

const makeTrack = (id, name, artist, year, popularity, durationMs, explicit = false) => ({
  id,
  name,
  popularity,
  duration_ms: durationMs,
  explicit,
  artists: [{ name: artist }],
  album: {
    release_date: `${year}-01-01`,
    images: [
      { url: 'https://i.scdn.co/image/ab67616d0000b2737b3516da0b1d9d41bfd2e7c8' },
      { url: 'https://i.scdn.co/image/ab67616d00001e027b3516da0b1d9d41bfd2e7c8' },
      { url: 'https://i.scdn.co/image/ab67616d00004851b5d374d281b9e510eba11378' },
    ],
  },
})

export const mockTracks = {
  items: [
    makeTrack('t1',  'Creep',                      'Radiohead',       1992, 82, 238000),
    makeTrack('t2',  'Fake Plastic Trees',          'Radiohead',       1995, 75, 247000),
    makeTrack('t3',  'Wake Up',                     'Arcade Fire',     2004, 70, 335000),
    makeTrack('t4',  'All I Want',                  'Kodaline',        2013, 72, 261000),
    makeTrack('t5',  'Skinny Love',                 'Bon Iver',        2007, 71, 213000),
    makeTrack('t6',  'Holocene',                    'Bon Iver',        2011, 74, 348000),
    makeTrack('t7',  'Bloodbuzz Ohio',              'The National',    2010, 68, 230000),
    makeTrack('t8',  'Breathe (In the Air)',        'Pink Floyd',      1973, 65, 163000),
    makeTrack('t9',  'Sound & Vision',              'David Bowie',     1977, 67, 199000),
    makeTrack('t10', 'Let Down',                    'Radiohead',       1997, 73, 295000),
    makeTrack('t11', 'The Less I Know the Better',  'Tame Impala',     2015, 86, 216000),
    makeTrack('t12', 'Space Song',                  'Beach House',     2015, 77, 307000),
    makeTrack('t13', 'Machine Gun',                 'Portishead',      2008, 61, 392000),
    makeTrack('t14', 'Teardrop',                    'Massive Attack',  1998, 76, 330000),
    makeTrack('t15', 'Where Is My Mind?',           'Pixies',          1988, 79, 234000),
    makeTrack('t16', 'Dreams',                      'Fleetwood Mac',   1977, 80, 257000),
    makeTrack('t17', 'Running Up That Hill',        'Kate Bush',       1985, 88, 300000),
    makeTrack('t18', 'Human Behaviour',             'Björk',           1993, 64, 262000),
    makeTrack('t19', 'Karma Police',                'Radiohead',       1997, 78, 264000),
    makeTrack('t20', 'Obstacles',                   'Syd Matters',     2005, 55, 231000, true),
  ],
}
