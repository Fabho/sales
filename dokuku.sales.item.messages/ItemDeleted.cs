﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NServiceBus;

namespace dokuku.sales.item.messages
{
    [Serializable]
    public class ItemDeleted : IMessage
    {
        public Guid Id { get; set; }
    }
}
