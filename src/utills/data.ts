export const tasks = [{
	id: 1,
	title: 'Ground Station A',
	start: new Date('2019-02-21T05:00:00.000Z'),
	end: new Date('2019-02-21T12:00:00.000Z')
}, {
	id: 2,
	title: 'Ground Station B',
	start: new Date('2019-02-21T08:30:00.000Z'),
	end: new Date('2019-02-21T12:00:00.000Z')
}];

export const stationsData = [
	{
		id: 1,
		title: 'Ground Station A',
		start: new Date('2019-02-21T05:00:00.000Z'),
		end: new Date('2019-02-21T12:00:00.000Z'),
		slots: [
			{
				start: new Date('2019-02-21T05:00:00.000Z'),
				end: new Date('2019-02-21T08:00:00.000Z')
			},
			{
				start: new Date('2019-02-21T09:00:00.000Z'),
				end: new Date('2019-02-21T10:00:00.000Z')
			},
			{
				start: new Date('2019-02-21T11:00:00.000Z'),
				end: new Date('2019-02-21T12:00:00.000Z')
			}
		]
	}, 
	{
		id: 2,
		title: 'Ground Station B',
		start: new Date('2019-02-21T05:00:00.000Z'),
		end: new Date('2019-02-21T12:00:00.000Z'),
		slots: [
			{
				start: new Date('2019-02-21T05:00:00.000Z'),
				end: new Date('2019-02-21T08:00:00.000Z')
			},
			{
				start: new Date('2019-02-21T09:00:00.000Z'),
				end: new Date('2019-02-21T10:00:00.000Z')
			},
			{
				start: new Date('2019-02-21T11:00:00.000Z'),
				end: new Date('2019-02-21T12:00:00.000Z')
			}
		]
	}
];
