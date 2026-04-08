exports.seed = async function(knex) {
  await knex('incidents').insert([
    // OPEN (bez hero)
    {
      id: 1,
      location: 'Street 1',
      district: null,
      level: 'low',
      status: 'open',
      hero_id: null,
      assigned_at: null,
      resolved_at: null
    },
    {
      id: 2,
      location: 'Street 2',
      district: 'Center',
      level: 'medium',
      status: 'open',
      hero_id: null,
      assigned_at: null,
      resolved_at: null
    },

    // ASSIGNED
    {
      id: 3,
      location: 'Street 3',
      district: 'North',
      level: 'critical',
      status: 'assigned',
      hero_id: 1,
      assigned_at: new Date(),
      resolved_at: null
    },
    {
      id: 4,
      location: 'Street 4',
      district: null,
      level: 'medium',
      status: 'assigned',
      hero_id: 2,
      assigned_at: new Date(),
      resolved_at: null
    },

    // RESOLVED
    {
      id: 5,
      location: 'Street 5',
      district: 'South',
      level: 'low',
      status: 'resolved',
      hero_id: 3,
      assigned_at: new Date(),
      resolved_at: new Date()
    },
    {
      id: 6,
      location: 'Street 6',
      district: null,
      level: 'critical',
      status: 'resolved',
      hero_id: 1,
      assigned_at: new Date(),
      resolved_at: new Date()
    },

    {
      id: 7,
      location: 'Street 7',
      district: 'West',
      level: 'medium',
      status: 'assigned',
      hero_id: 5,
      assigned_at: new Date(),
      resolved_at: null
    },
    {
      id: 8,
      location: 'Street 8',
      district: 'East',
      level: 'critical',
      status: 'resolved',
      hero_id: 2,
      assigned_at: new Date(),
      resolved_at: new Date()
    }
  ]);
};